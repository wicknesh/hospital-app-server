import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import hospiceRoute from './route/hospiceRoute.js';

const app = new express();
app.use(morgan('dev'));

app.use(express.json());

app.use('/hospices', hospiceRoute);

app.listen(process.env.port, () => {
    console.log(`Server is up and listening on port ${process.env.port}`);
});