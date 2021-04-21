import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { userRouter } from './router';

// read variable from .env file
import 'dotenv/config';

// rest of the code remains same
const app: express.Application = express();
const PORT = process.env.PORT;
const mongoURL = process.env.MONGO_URI!;
app.use(express.json());

app.use(userRouter);

mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connect to mongodb success'))
    .catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
