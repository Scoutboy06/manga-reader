console.clear();

import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import parseArguments from './functions/parseArguments.js';

import mangaRoutes from './routes/mangaRoutes.js';
import hostRoutes from './routes/hostRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { getMangaUpdates } from './controllers/updatesController.js';
// import testController from './controllers/test.js';

import Manga from './models/mangaModel.js';
import sendDiscordWebhookUpdate from './functions/sendDiscordWebhookUpdate.js';
import asyncHandler from 'express-async-handler';

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/api/mangas', mangaRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/test', testController);

app.use('/api/dc/:_id', asyncHandler(async (req, res) => {
	const { _id } = req.params;
	const manga = await Manga.findById(_id);
	if (!manga) throw new Error(404);
	await sendDiscordWebhookUpdate(manga);
	res.json(manga);
}));

app.use('/api/test', asyncHandler(async (req, res) => {
	const mangas = await Manga.find({});
	const updatedMangas = await Promise.all(mangas.map(manga => new Promise(async (resolve, reject) => {
		manga.lastUpdatePingedChapter = manga.chapter;
		await manga.save();
		resolve(manga);
	})));
	res.json(updatedMangas);
}));

app.get('/api/getUpdates', getMangaUpdates);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
	parseArguments();
});
