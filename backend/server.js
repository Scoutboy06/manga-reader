import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import fetch from 'node-fetch';

import connectDB from './config/db.js';

import { notFound, errorCatcher } from './middleware/errorMiddleware.js';

import updatesChecker from './functions/updatesChecker.js';
import asyncMap from './functions/asyncMap.js';

import router from './router.js';

// import Manga from './models/mangaModel.js';
// import Host from './models/hostModel.js';
import Anime from './models/animeModel.js';

const app = express();
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env.local') });

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(cors());

app.use(router);

app.use('/tmdb/*', async (req, res) => {
	const data = await fetch(`https://api.themoviedb.org/3/${req.params[0]}?` + new URLSearchParams({
		api_key: process.env.TMDB_V3_API_KEY,
		...req.query,
	})).then(res => res.json());

	res.json(data);
});

app.use('/test', async (req, res) => {
	// const mangas = await Manga.find({});
	// const hosts = await Host.find({});
	const animes = await Anime.find({});

	const data = await asyncMap(animes, async anime => {
		for (const season of anime.seasons) {
			// season.set('hasWatched', false);
			// season.set('hasNewEpisodes', false);
			// season.set('isAiring', false);

			for (const part of season.parts) {
				for (const episode of part.episodes) {
				}
			}
		}

		const saved = await anime.save();
		return saved;
	});

	res.json(data);
});

app.use(errorCatcher);
app.use(notFound);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.clear();
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

	connectDB();

	// If "--no-updates" isn't specified in command input
	if (!process.argv.find(arg => arg === '--no-updates')) updatesChecker();
});
