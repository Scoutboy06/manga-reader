console.clear();

import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import parseArguments from './functions/parseArguments.js';

import router from './router.js';

import { getMangaUpdates } from './controllers/updatesController.js';

import Manga from './models/mangaModel.js';
import sendDiscordWebhookUpdate from './functions/sendDiscordWebhookUpdate.js';
import asyncHandler from 'express-async-handler';

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const app = express();
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(cors());

app.use('/api/', router);

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
