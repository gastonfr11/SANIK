import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import productsRouter from './routes/products.routes.js';
import collectionsRouter from './routes/collections.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/products', productsRouter);
app.use('/api/collections', collectionsRouter);

app.use(errorHandler);
export default app;
