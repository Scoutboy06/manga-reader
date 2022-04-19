import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import mangaRoutes from './routes/mangaRoutes.js';
import hostRoutes from './routes/hostRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { getMangaUpdates } from './controllers/updatesController.js';
// import testController from './controllers/test.js';


const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// app.use((req, res, next) => {
// 	req.headers['if-none-match'] = 'no-match-for-this';
// 	next();
// });

app.use('/api/mangas', mangaRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/test', testController);

app.get('/api/getUpdates', getMangaUpdates);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
