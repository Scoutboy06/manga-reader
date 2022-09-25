console.clear();

import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import fetch from 'node-fetch'
import chalk from 'chalk';

import connectDB from './config/db.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// import parseArguments from './functions/parseArguments.js';
import updatesChecker from './functions/updatesChecker.js';

import router from './router.js';
// import getMangaMetadata from './functions/manga/getMetadata.js';

import Manga from './models/mangaModel.js';
import Host from './models/hostModel.js';
import Anime from './models/animeModel.js';

import sendDiscordWebhookUpdate from './functions/sendDiscordWebhook.js';
import asyncHandler from 'express-async-handler';

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

const db = connectDB();

const app = express();
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(cors());

app.use('/', router);

app.use('/dc/:_id', asyncHandler(async (req, res) => {
	const { _id } = req.params;
	const manga = await Manga.findById(_id);
	if (!manga) throw new Error(404);
	await sendDiscordWebhookUpdate(manga);
	res.json(manga);
}));

app.use('/tmdb/*', asyncHandler(async (req, res) => {
	const data = await fetch(`https://api.themoviedb.org/3/${req.params[0]}?` + new URLSearchParams({
		api_key: process.env.TMDB_V3_API_KEY,
		...req.query,
	})).then(res => res.json());

	res.json(data);
}));

app.use('/test', async (req, res) => {
	// const mangas = await Manga.find({});
	// const hosts = await Host.find({});
	// const animes = await Anime.find({});

	res.json({});
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
	updatesChecker();
});
