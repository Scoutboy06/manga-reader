import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
// import HTMLParser from 'node-html-parser';

import Anime from '../models/animeModel.js';
import User from '../models/userModel.js';

import getAnimeMeta from '../functions/anime/getAnimeMeta.js';
import getAnimeEpisode from '../functions/anime/getAnimeEpisode.js';

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

	// const continueWatching = [];
	// const favorites = [];
	// const popular = [];
	// const newSeason = [];
	// const recentRelease = [];
	const animes = await Anime.find({ ownerId: userId });


	let removeFields = ['ownerId', 'tmdbId', 'description', 'seasons', 'seasonId', 'genres', 'released', 'status', 'otherNames'];

	for (const anime of animes) {
		for (const field of removeFields) {
			anime[field] = undefined;
		}
	}


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
		sourceUrlName,
		// title,
		// description,
		// poster,
		// backdrop,
		tmdbSeasonId,
		part,
		tmdbId,
		mediaType = 'tv',
	} = req.body;

	const gogoMeta = await getAnimeMeta(sourceUrlName);

	if (from === 'tmdb') {
		const tmdbMeta = await fetch(`https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${process.env.TMDB_V3_API_KEY}`)
			.then(res => res.json());

		if (tmdbMeta.success === false) {
			res.status(404);
			throw new Error('Invalid TMDB id or media type');
		}

		const tmdbSeason = tmdbMeta.seasons.find(season => season.id == tmdbSeasonId);

		const newPart = {
			number: part,
			sourceUrlName,
			status: gogoMeta.status.toLowerCase(),
			episodes: gogoMeta.episodes,
		};

		const newSeason = {
			name: tmdbSeason.name,
			urlName: tmdbSeason.name.toLowerCase().replaceAll(' ', '-'),
			sourceUrlName,
			description: tmdbSeason.overview,
			tmdbId: tmdbSeasonId,
			poster: {
				large: `https://image.tmdb.org/t/p/original${tmdbSeason.poster_path}`,
				small: `https://image.tmdb.org/t/p/w300${tmdbSeason.poster_path}`,
			},
			parts: [newPart],
			status: gogoMeta.status.toLowerCase(),
		};


		// If anime is not in db, add it and return
		const existingAnime = await Anime.findOne({ tmdbId, ownerId: userId });
		if (!existingAnime) {
			console.log('New anime');
			const anime = new Anime({
				ownerId: userId,
				tmdbId,
				urlName: encodeURI(tmdbMeta.name.toLowerCase().replaceAll(':', '').replaceAll(' ', '-')),

				title: tmdbMeta.name,
				description: tmdbMeta.overview,
				mediaType,

				seasons: [newSeason],
				// currentSeasonId: 
				// currentEpisodeId: 

				genres: gogoMeta.genres,
				released: gogoMeta.released,
				status: gogoMeta.status,
				otherNames: gogoMeta.otherNames,

				poster: newSeason.poster,
				backdrop: {
					large: `https://image.tmdb.org/t/p/original${tmdbMeta.backdrop_path}`,
					small: `https://image.tmdb.org/t/p/w300${tmdbMeta.backdrop_path}`,
				},
			});

			const createdAnime = await anime.save();
			return res.status(201).json(createdAnime);
		}


		// If season is not in db, add it in it's chronological order
		const existingSeason = existingAnime.seasons.find(season => season.tmdbId === tmdbSeasonId);
		if (!existingSeason) {
			console.log('New season');
			let hasInsertedNewSeason = false;
			const seasons = [];

			// Insert the new season in order
			for (let i in tmdbMeta.seasons) {
				// See if the current season is already in db
				const existingSeason = existingAnime.seasons.find(season =>
					season.tmdbId === tmdbMeta.seasons[i].id
				);

				if (existingSeason) seasons.push(existingSeason);
				else if (tmdbMeta.seasons[i].id === tmdbSeasonId) {
					seasons.push(newSeason);
					hasInsertedNewSeason = true;
				}
			}

			if (!hasInsertedNewSeason) seasons.push(newSeason);

			existingAnime.seasons = seasons;

			const savedAnime = await existingAnime.save();
			return res.json(savedAnime);
		}

		console.log('New part');

		// If the part already exists in db, remove it (and add it in the next step)
		const existingPartIndex = existingSeason?.parts?.findIndex(p => p.number === part);
		if (existingPartIndex !== -1) {
			existingSeason.splice(existingPartIndex, 1);
		}


		// 1. Add the new part to the season,
		// 2. Sort the array
		// 3. Update the episodes' number and urlName
		existingSeason.parts.push(newPart);
		existingSeason.parts.sort((partA, partB) => partA.number - partB.number);
		let episodeNumber = 1;
		for (let i in existingSeason.parts) {
			const part = existingSeason.parts[i];

			for (let j in part.episodes) {
				const episode = part.episodes[j];

				episode.number = episodeNumber;
				episode.urlName = `episode-${episodeNumber}`;

				episodeNumber++;
			}
		}


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

	const scrapedEpisode = await getAnimeEpisode(episode.sourceUrlName);
	scrapedEpisode.number = season.episodes.indexOf(episode) + 1;
	res.json(scrapedEpisode);
});

// @desc	Delete an anime
// @route	DELETE /animes/:animeId
export const deleteAnime = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const anime = await Anime.findById(id);
	if (!anime) {
		res.status(404);
		throw new Error('No anime found');
	}

	await anime.remove();
});

