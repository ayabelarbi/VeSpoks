import {Request, Response, Router} from 'express';
import {IPhone, Phone} from "../dto";
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

router.post('/phone', async (req: Request, res: Response): Promise<void> => {
    try {
        const phone = req.body as IPhone;
        console.log(req.body);
        const isNew = !await Phone.exists({imsi: phone.imsi});
        if (isNew) {
            await Phone.create(phone);
            res.status(201).json(JSON.stringify(phone));
        } else {
            res.status(200).json(JSON.stringify(phone));
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
})


export default router;



