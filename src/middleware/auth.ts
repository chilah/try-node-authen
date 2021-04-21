import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response, RequestHandler } from 'express';
import { MongooseDocumentMiddleware } from 'mongoose';
import User from '../models/User';
import { RequestWithAuth } from '../types';

export interface IDecode {
    id: string;
}

const authen = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Unable to Authorized');
        }

        const decode = jwt.verify(token, 'tryn0d3');
        const user = await User.findOne({ _id: (decode as IDecode).id }).select(
            '-password -tokens',
        );

        req.user = user;

        next();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

export default authen;
