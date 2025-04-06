import {Request, Response, Router} from 'express';

import {Data, Login, LoginVerify, Signin, User, Wallet} from "../dto/index";
import {Claim} from "../dto/Claim";
import {PublicKey} from "@solana/web3.js";
import { mintToAddress } from '../tx/mintToAddress';
import * as crypto from 'crypto';

const router: Router = Router();

router.get('/check-signin', async (req: Request, res: Response): Promise<void> => {
    try {
        const walletAddress = req.query.wallet as string;

        if (!walletAddress) {
            console.log(walletAddress);
            console.log(Wallet);
            res.status(400).json({ error: 'Wallet address is required' });
            return;
        }

        const wallet = await Wallet.findOne({ wallet: walletAddress });
        if (wallet) {
            res.status(200).json({ signedIn: true });
        } else {
            res.status(404).json({ signedIn: false });
        }
    } catch (error) {
        console.error('Error checking signin:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/signin', async (req: Request, res: Response): Promise<void> => {
    try {
        const signin = req.body as Signin;
        console.log(JSON.stringify(signin));
        const isNew = !await Wallet.exists({phone: signin.phone});
        if (isNew) {
            await Wallet.create({phone: signin.phone, wallet: signin.wallet});
            res.status(201).json({created: JSON.stringify(signin)});
        } else {
            res.status(200).json({ok: JSON.stringify(signin)});
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
})

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const login = req.body as Login;
        const wallet = await Wallet.findOne({wallet: login.wallet});
        if (wallet) {
            const url = `https://web-production.lime.bike/api/rider/v1/login?phone=${encodeURIComponent(wallet.phone)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            res.status(response.status).json({phone: wallet.phone});

        } else {
            res.status(404).json({not_found: JSON.stringify(login)});
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
})

router.post('/login/verify', async (req: Request, res: Response): Promise<void> => {
    try {
        const loginVerify = req.body as LoginVerify;
        const wallet = await Wallet.findOne({wallet: loginVerify.wallet});
        if (wallet) {
            const url = 'https://web-production.lime.bike/api/rider/v1/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login_code: loginVerify.otp,
                    phone: wallet.phone
                })
            });
            if (response.ok) {
                const json = await response.json();
                const user = json as User;
                wallet.token = user.token;
                await wallet.save();
                res.status(response.status).json(json);
            } else {
                res.status(response.status).send();
            }
        } else {
            res.status(404).json({not_found: JSON.stringify(loginVerify)});
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
})

router.post('/claim', async (req: Request, res: Response): Promise<void> => {
    try {
        const claim = req.body as Claim;
        const wallet = await Wallet.findOne({wallet: claim.wallet});

        if (wallet) {
            const url = 'https://web-production.lime.bike/api/rider/v1/user';
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${wallet.token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const json = await response.json();
                const data = json as Data;
                const trips = data.data.attributes.num_trips ?? 0;
                const quantity = trips - (wallet.trips ?? 0);
                wallet.trips = trips;
                
                // Generate a unique random ID for this transaction
                const id = new Uint8Array(32);
                crypto.randomFillSync(id);

                if (quantity > 0) {

                    await mintToAddress(
                        "bike",
                        quantity,
                        id,
                        new PublicKey(claim.wallet),
                    );
                    wallet.save();
                }
                
                res.status(response.status).json({rewards: quantity, trips: trips});
            } else {
                res.status(response.status).send();
            }
        }
    } catch (error) {
        res.status(500).json({message: `${error}`});
    }
})

router.delete('/db', async (_req: Request, res: Response): Promise<void> => {
    try {
        await Wallet.deleteMany();
        res.status(200).json({message: "Reset"});
    } catch (error) {
        res.status(500).json({message: "Reset Error"});
    }
});

export default router;



