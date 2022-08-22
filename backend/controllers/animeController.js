import asyncHandler from 'express-async-handler';
// import fetch from 'node-fetch';
// import HTMLParser from 'node-html-parser';

import Anime from '../models/animeModel.js';

import getAnimeMeta from '../functions/scrape/getAnimeMeta.js';
import getAnimeEpisode from '../functions/scrape/getAnimeEpisode.js';

// @desc	Create an anime to save in the database
// @route	POST /users/:userId/animes
export const addAnimeToLibrary = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const { urlName, season, tmdbId } = req.body;

	const dbRes = await Anime.findOne({ urlName, ownerId: userId });
	if (dbRes) {
		res.status(405);
		throw new Error('Anime is already in library.');
	}

	const gogoMeta = await getAnimeMeta(urlName);

	let tmdbMeta;
	if (tmdbId) {
		tmdbMeta = await fetch(`https://api.themoviedb.org/3/tv?` + new URLSearchParams({
			api_key: process.env.TMDB_V3_API_KEY,
			tv_id: tmdbId,
		})).then(res => res.json());
	} else {
		tmdbMeta = await fetch('https://api.themoviedb.org/3/search/tv?' + new URLSearchParams({
			api_key: process.env.TMDB_V3_API_KEY,
			query: gogoMeta.name,
		})).then(res => res.json()).then(json => json.results[0]);
	}

	if (!tmdbMeta) {
		res.status(404);
		throw new Error('No results from TMDB');
	}

	const anime = new Anime({
		ownerId: userId,

		title: tmdbMeta.name,
		description: tmdbMeta.overview,
		mediaType: tmdb.media_type,

		...gogoMeta,
		isFavorite: false,
		hasWatched: false,
		notificationsOn: false,

		poster: {
			small: tmdbMeta.poster_path ? `https://image.tmdb.org/t/p/w300${tmdbMeta.poster_path}` : gogoMeta.posters.large,
			large: tmdbMeta.poster_path ? `https://image.tmdb.org/t/p/original${tmdbMeta.poster_path}` : gogoMeta.posters.large,
		},
		backdrop: {
			small: tmdbMeta.backdrop_path ? `https://image.tmdb.org/t/p/w400${tmdbMeta.backdrop_path}` : gogoMeta.posters.large,
			large: tmdbMeta.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbMeta.backdrop_path}` : gogoMeta.posters.large,
		}
	});

	const createdAnime = await anime.save();
	return res.json(createdAnime);
});

// @desc	Get an anime by it's url name
// @route	GET /users/:userId/animes/:urlName
export const getAnimeByUrlName = asyncHandler(async (req, res) => {
	const { urlName, userId } = req.params;

	const dbAnime = await Anime.findOne({ urlName, ownerId: userId });
	if (!dbAnime) {
		const scrapeAnime = await getAnimeMeta(urlName);
		return res.json({ ...scrapeAnime, from: 'scrape' });
	}

	res.json({ ...dbAnime, from: 'db' });
});

// @desc	Get an anime by it's id or it's urlName
// @route	GET /animes/:_id
export const getAnimeById = asyncHandler(async (req, res) => {
	const { _id } = req.params;

	const dbRes = await Anime.findById(_id);
	if (!dbRes) {
		const anime = await getAnimeMeta(_id);
		return res.json(anime);
	}

	return res.json(dbRes);
});

// @desc	Get metadata about a single episode
// @route	GET /animes/:_id/episode-:episodeNumber
export const getEpisode = asyncHandler(async (req, res) => {
	const { _id, episodeNumber } = req.params;
	const episode = await getAnimeEpisode(_id, Number(episodeNumber));
	res.json(episode);
});

// @desc	Delete an anime
// @route	PUT /users/:userId/animes/:animeId
export const deleteAnime = asyncHandler(async (req, res) => {
	const { userId, urlName } = req.params;
});

