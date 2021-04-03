import express, { Request, Response } from 'express';
import { Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import User, { IUser, UserDocument } from '../models/User';

const router = express.Router();

router.post('/user', async (req: Request, res: Response) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/user', async (req, res) => {
    const users = await User.find({});

    res.status(200).send(users);
});

router.post('/user/login', async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });

    res.send(user);
});

export default router;
