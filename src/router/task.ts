import { Request, Response, Router } from 'express';
import Task from '../models/Task';
import { authen } from '../middleware';
import { RequestWithAuth } from 'handler';

const router = Router();

router.post('/tasks', authen, async (req: RequestWithAuth, res: Response) => {
    try {
        const task = new Task({ ...req.body, owner: req.user?._id });

        await task.save();

        res.status(200).send({ task });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/tasks', authen, async (req: RequestWithAuth, res: Response) => {
    try {
        await req.user?.populate('tasks').execPopulate();

        res.status(200).send({ task: req.user?.tasks });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;
