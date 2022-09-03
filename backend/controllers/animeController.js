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
		// {
		// 	title: 'Continue watching',
		// 	type: 'video',
		// 	media: animes.filter(anime =>
		// 		anime.seasons.find(season =>
		// 			season.episodes[0] !== '' && season.episodes.find(episode => episode.status === '')
		// 		))
		// },
		// {
		// 	title: 'Your favorites',
		// 	type: 'series',
		// 	media: animes.filter(anime => anime.isFavorite),
		// },
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
	const {
		from,
		gogoUrlName,
		title,
		description,
		poster,
		backdrop,
		seasonId,
		tmdbId,
		mediaType = 'tv',
	} = req.body;

	const existingAnime = await Anime.findOne({ tmdbId, ownerId: userId });
	const gogoMeta = await getAnimeMeta(gogoUrlName);

	if (from === 'customImport') {
		const tmdbMeta = await fetch(`https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${process.env.TMDB_V3_API_KEY}`)
			.then(res => res.json());

		if (tmdbMeta.success === false) {
			res.status(404);
			throw new Error('Invalid TMDB id or media type');
		}

		if (existingAnime?.seasons?.find(season => season.id === seasonId)) {
			res.status(405);
			throw new Error('Season is already saved');
		}

		const tmdbSeason = tmdbMeta.seasons.find(season => season.id == seasonId);

		const newSeason = {
			name: tmdbSeason.name,
			urlName: tmdbSeason.name.toLowerCase().replaceAll(' ', '-'),
			gogoUrlName,
			description,
			id: seasonId,
			poster,
			episodes: gogoMeta.episodes,
		};

		// If anime is not in db, add it
		if (!existingAnime) {
			const anime = new Anime({
				ownerId: userId,
				tmdbId,
				urlName: encodeURI(title.toLowerCase().replaceAll(':', '').replaceAll(' ', '-')),

				title,
				description,
				mediaType,

				seasons: [newSeason],
				seasonId,

				genres: gogoMeta.genres,
				released: gogoMeta.released,
				status: gogoMeta.status,
				otherNames: gogoMeta.otherNames,

				poster,
				backdrop,
			});

			const createdAnime = await anime.save();
			return res.status(201).json(createdAnime);
		}

		// Rearrange seasons in order
		const seasons = [];
		for (let i = 0; i < tmdbMeta.seasons.length; i++) {
			const existingSeason = existingAnime.seasons.find(season =>
				season.id === tmdbMeta.seasons[i].id
			);

			if (existingSeason) seasons.push(existingSeason);
			else if (tmdbMeta.seasons[i].id === seasonId) seasons.push(newSeason);
		}

		existingAnime.seasons = seasons;
		const savedAnime = await existingAnime.save();
		res.json(savedAnime);
		return;
	}


	const anime = new Anime({
		ownerId: userId,
		...gogoMeta,
	});

	const createdAnime = await anime.save();
	res.status(201).json(createdAnime);
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
// @route	GET /users/:userId/animes/:animeUrlName/:seasonUrlName/:episodeUrlName
export const getEpisode = asyncHandler(async (req, res) => {
	const { userId, animeUrlName, seasonUrlName, episodeUrlName } = req.params;

	const anime = await Anime.findOne({ urlName: animeUrlName, ownerId: userId });
	if (!anime) {
		res.status(404);
		throw new Error('No anime found');
	}

	const season = anime.seasons.find(season => season.urlName === seasonUrlName);
	if (!season) {
		res.status(404);
		throw new Error('No season found');
	}

	const episode = season.episodes.find(episode => episode.urlName === episodeUrlName);
	if (!episode) {
		res.status(404);
		throw new Error('No episode found');
	}

	const scrapedEpisode = await getAnimeEpisode(episode.gogoUrlName);
	scrapedEpisode.number = season.episodes.indexOf(episode) + 1;
	res.json(scrapedEpisode);
});

// @desc	Delete an anime
// @route	PUT /users/:userId/animes/:animeId
export const deleteAnime = asyncHandler(async (req, res) => {
	const { userId, urlName } = req.params;
});

