import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan'
import cors from 'cors';
import logger from './logger/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'My App';
const APP_URL = process.env.APP_URL || 'http://localhost:';

app.use(cors());
app.use(express.json());
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

app.get('/', (req, res) => {
    logger.info('Homepage diakses');
    res.send(`Hai dari ${process.env.APP_NAME}`);
});

app.get('/error', (req, res) => {
    logger.error('Error terjadi di /error');
    res.status(500).send('Terjadi error');
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${APP_URL}`);
});