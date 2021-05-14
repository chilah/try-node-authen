import express, { NextFunction, Request, Response, Router, ErrorRequestHandler } from 'express';
import User, { IUser, UserDocument } from '../models/User';
import { authen } from '../middleware';
import { RequestWithAuth } from '../types/handler';
import multer from 'multer';

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

router.get('/user', async (req: Request, res: Response) => {
    const users = await User.find({});

    res.status(200).send(users);
});

router.post('/user/login', async (req: Request, res: Response) => {
    try {
        const user = await User.findByAuthen(req.body);
        const token = await user.generateToken();

        res.status(200).send({ email: user.email, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/user/me', authen, async (req: RequestWithAuth, res: Response) => {
    try {
        res.status(200).send({ user: req.user });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.patch('/user/me', authen, async (req: RequestWithAuth, res: Response) => {
    try {
        const updateList = Object.keys(req.body);
        const allowUpdate = ['firstname', 'lastname'];

        const isAllow = updateList.every((u) => allowUpdate.includes(u));

        if (!isAllow) {
            throw Error('Unable to update');
        }

        const userObj = req.user?.toObject();

        await req.user?.updateOne({ ...userObj, ...req.body });

        res.status(200).send({ message: `Updated ${req.user?.email} profile successfully` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.delete('/user/me', authen, async (req: RequestWithAuth, res: Response) => {
    try {
        await req.user?.remove();

        res.status(200).send({ message: `Removed ${req.user?.email} successfully` });
    } catch (error) {
        res.send({ error: error.message });
    }
});

const upload = multer({
    limits: {
        fileSize: 100000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a JPG or PNG file'));
        }

        cb(null, true);
    },
});

router.post(
    '/user/me/avatar',
    authen,
    upload.single('avatar'),
    async (req: RequestWithAuth, res: Response) => {
        if (req.user) {
            req.user.avatar = req.file.buffer;

            await req.user.save();
            res.status(200).send({ success: 'Upload image successfully' });
        }
    },
    (error: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).send({ error: error.message });
    },
);

router.delete('/user/me/avatar', authen, async (req: RequestWithAuth, res: Response) => {
    try {
        if (req.user) {
            req.user.avatar = undefined;

            await req.user.save();
            res.status(200).send({ success: 'Delete image successfully' });
        }
    } catch (error) {
        res.status(400).send({ success: 'Unable to delete image' });
    }
});

// Get avatar by id
router.get('/user/:id/avatar', async (req: RequestWithAuth, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw Error();
        }

        res.set('Content-type', 'image/jpg');
        res.send(user?.avatar);
    } catch (error) {
        res.status(404).send({ error: `Unable to find an avatar` });
    }
});
export default router;
