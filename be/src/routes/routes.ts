import {Request, Response, Router} from 'express';
import {Login, Phone} from "../dto";
import mongoose from "mongoose";


const mongo = async (): Promise<void> => {
    try {
        await mongoose.connect('mongodb://localhost:27017/vemob');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};
mongo();

const router: Router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const login = req.body as Login;
        console.log(req.body);
        const isNew = !await Phone.exists({imsi: login.imsi});
        if (isNew) {
            await Phone.create({imsi: login.imsi});
            res.status(201).json(JSON.stringify(login));
        } else {
            res.status(200).json(JSON.stringify(login));
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
})

router.get('/reset', async (_req: Request, res: Response): Promise<void> => {
    try {
        await Phone.deleteMany();
        res.status(200).json({message: "Reset"});
    } catch (error) {
        res.status(500).json({message: "Reset Error"});
    }
});


export default router;



