import { Request, Response } from 'express';
import { IUser, UserDocument } from '../models/User';

export interface RequestWithAuth extends Request {
    user?: UserDocument | null;
}
