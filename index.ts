import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { userRouter } from './src/router';

// rest of the code remains same
const app: express.Application = express();
const PORT = 8000;

app.use(express.json());

app.use(userRouter);

mongoose
    .connect('mongodb+srv://learn-mongo:learn-mongo@cluster0.qdzps.mongodb.net/shopping-db', {
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
