import {Request, Response, Router} from 'express';
import {Phone} from "../dto";


const router: Router = Router();

/**
 * As solver REST service administrator, revert all un-reverted transfers
 * in chronological order from the most recent to the oldest.
 */
router.post('/phone', async (req: Request, res: Response): Promise<void> => {
    try {
        const phone = req.body as Phone;
        console.log(req.body);
        res.status(200).json(JSON.stringify(phone));
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
})


export default router;



