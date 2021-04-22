import express, { Request, Response, Router } from 'express';

const router = express.Router();

router.get('/tasks', async (req: Request, res: Response) => {
    res.send('tasks');
});

export default router;
