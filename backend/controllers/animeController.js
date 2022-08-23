import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
// import HTMLParser from 'node-html-parser';

import Anime from '../models/animeModel.js';
import User from '../models/userModel.js';

import getAnimeMeta from '../functions/scrape/getAnimeMeta.js';
import getAnimeEpisode from '../functions/scrape/getAnimeEpisode.js';

// @desc	Fetch the user's anime landing page
// @route	GET /users/:userId/animes
export const getAnimeLibrary = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	const user = await User.findById(userId);
	if (!user) {
		res.status(400);
		throw new Error('No user');
	}

	/*
	Continue watching
		(New episodes - subscribed)
	Your favorites
	Popular
	New season
	Recent realease
	(Popular ongoing update)
	*/

	const animes = await Anime.find({ ownerId: userId });

	const fields = [
		{
			title: 'Continue watching',
			type: 'video',
			media: animes.filter(anime => anime.episodes.find(episode => episode.status === '')),
		},
		{
			title: 'Your favorites',
			type: 'series',
			media: animes.filter(anime => anime.isFavorite),
		},
		{
			title: 'Your library',
			type: 'series',
			media: animes,
		},
		// {
		// 	title: 'Popular',
		// 	type: 'series',
		// 	media: []
		// },
		// {
		// 	title: 'New season',
		// 	type: 'series',
		// 	media: [],
		// },
		// {
		// 	title: 'Recent release',
		// 	type: 'series',
		// 	media: [],
		// },
	];

	res.json(fields);
});


// @desc	Create an anime to save in the database
// @route	POST /users/:userId/animes
export const addAnimeToLibrary = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const { urlName, seasonId, tmdbId } = req.body;

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
			query: gogoMeta.title,
		})).then(res => res.json()).then(json => json.results[0]);
	}

	if (!tmdbMeta) {
		res.status(404);
		throw new Error('No results from TMDB');
	}

	let seasonNumber;
	if (tmdbMeta.seasons) {
		if (seasonId) {
			seasonNumber = tmdbMeta.seasons.find(season => season.id === seasonId).season_number;
		} else {
			seasonNumber = tmdbMeta.seasons[0].season_number;
		}
	} else {
		seasonNumber = null;
	}

	const anime = new Anime({
		ownerId: userId,
		tmdbId: tmdbMeta.id,

		title: tmdbMeta.name,
		description: tmdbMeta.overview,

		...gogoMeta,

		mediaType: tmdbMeta.media_type,

		seasons: tmdbMeta.seasons ? tmdbMeta.seasons.map(season => ({
			name: season.name,
			seasonNumber: season.season_number,
			id: season.id,
			poster: {
				small: tmdbMeta.poster_path ? `https://image.tmdb.org/t/p/w300${season.poster_path}` : null,
				large: tmdbMeta.poster_path ? `https://image.tmdb.org/t/p/original${season.poster_path}` : null,
			},
		})) : null,
		seasonNumber,

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

	dbAnime.from = 'db';

	res.json(dbAnime);
});

// @desc	Get metadata about a single episode
// @route	GET /users/:userId/animes/:urlName/episode-:episodeNumber
export const getEpisode = asyncHandler(async (req, res) => {
	const { userId, urlName, episodeNumber } = req.params;
	const episode = await getAnimeEpisode(urlName, Number(episodeNumber));
	res.json(episode);
});

// @desc	Delete an anime
// @route	PUT /users/:userId/animes/:animeId
export const deleteAnime = asyncHandler(async (req, res) => {
	const { userId, urlName } = req.params;
});

