import express, { Request, Response } from 'express';
import weatherRouter from './routes/weather.routes';
import flightRouter from './routes/flights.routes';

import * as dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express();


const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());




app.use('/weather', weatherRouter);
app.use('/flight',flightRouter);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
