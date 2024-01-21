import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose, {ConnectOptions} from "mongoose";

import {apiRouter} from "./routes/api/";
import * as path from "path";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({origin: '*'}));

app.use('/api', apiRouter);
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mongoose.set('strictQuery', false);
const mongoUri = process.env.MONGO_URI!;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions).then(() => {
    console.log('connected to DB', mongoUri);
}).catch(err => {
    console.log('db connection error ', err);
});

app.use((req: Request, res: Response) => {
    res.status(404)
        .type('text')
        .send('Not found!');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
