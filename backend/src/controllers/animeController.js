import { Router } from 'express';
import fetch from 'node-fetch';
import handler from 'express-async-handler';

import Anime from '../models/animeModel.js';
import User from '../models/userModel.js';

import getAnimeMeta from '../functions/anime/getAnimeMeta.js';
import getAnimeEpisode from '../functions/anime/getAnimeEpisode.js';

const router = Router();


// @desc	Fetch the user's anime landing page
// @route	GET /users/:userId/animes
router.get('/users/:userId/animes', handler(async (req, res, next) => {
	const { limit = 50, skip = 0, query = '' } = req.query;
	const { userId } = req.params;

	const user = await User.findById(userId, { animes: 1 });

	res.json(user.animes);
}));


// @desc	Create an anime to save in the database
// @route	POST /users/:userId/animes
router.post('/users/:userId/animes', async (req, res) => {
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
			episodes: gogoMeta.episodes.map(episode => ({ ...episode, watchStatus: '' })),
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
				status: gogoMeta.status.toLowerCase(),
				otherNames: gogoMeta.otherNames,

				poster: {
					large: `https://image.tmdb.org/t/p/original${tmdbMeta.poster_path}`,
					small: `https://image.tmdb.org/t/p/w300${tmdbMeta.poster_path}`,
				},
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
router.get('/users/:userId/animes/:urlName', async (req, res) => {
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
router.get('/users/:userId/animes/:animeUrlName/:seasonUrlName/:episodeUrlName', async (req, res, next) => {
	const { userId, animeUrlName, seasonUrlName, episodeUrlName } = req.params;

	const anime = await Anime.findOne({ urlName: animeUrlName, ownerId: userId });
	if (!anime) {
		res.status(404);
		return next(new Error('No anime found'));
	}

	const season = anime.seasons.find(season => season.urlName === seasonUrlName);
	if (!season) {
		res.status(404);
		return next(new Error('No season found'));
	}

	let foundPart, foundEpisode;

	for (const part of season.parts) {
		for (const episode of part.episodes) {
			if (episode.urlName === episodeUrlName) {
				foundPart = part;
				foundEpisode = episode;
				break;
			}
		}
	}

	if (!foundPart || !foundEpisode) {
		res.status(404);
		return next(new Error('Episode not found'));
	}

	const scrapedEpisode = await getAnimeEpisode(foundEpisode.sourceUrlName);
	scrapedEpisode.number = foundEpisode.number;
	res.json(scrapedEpisode);
});

// @desc	Delete an anime
// @route	DELETE /animes/:animeId
router.delete('/animes/:animeId', async (req, res, next) => {
	const { id } = req.params;

	const anime = await Anime.findById(id);
	if (!anime) {
		res.status(404);
		return next(new Error('No anime found'));
	}

	await anime.remove();
	res.status(201).json({ message: 'Anime was successfully deleted' });
});


// @desc	Update an anime
// @route	PATCH /animes/:animeId
router.patch('/animes/:animeId', async (req, res, next) => {
	const { animeId } = req.params;

	const anime = await Anime.findById(animeId);
	if (!anime) {
		res.status(404);
		return next(new Error('No anime found'));
	}

	const allowedKeys = [
		'title',
		'urlName',
		'description',
		'isAiring',
		'notificationsOn',
		'hasWatched',
	];

	for (const key of Object.keys(req.body)) {
		if (allowedKeys.includes(key)) anime[key] = req.body[key];
	}

	const savedAnime = await anime.save();
	res.json(savedAnime);
});


// @desc	Update anime, season and episode's watch status
// @route PATCH /users/:userId/animes/:animeUrlName/:seasonUrlName/:episodeUrlName
router.patch('/users/:userId/animes/:animeUrlName/:seasonUrlName/:episodeUrlName', async (req, res, next) => {
	const { userId, animeUrlName, seasonUrlName, episodeUrlName } = req.params;
	const { hasWatched, isFavorite } = req.body;

	const user = await User.findById(userId).catch(err => {
		res.status(404);
		next(err);
	});
	if (!user) return;

	const anime = await Anime.findOne({ urlName: animeUrlName }).catch(err => {
		res.status(404);
		next(new Error('No anime found'));
	});

	if (!anime) return;

	const season = anime.seasons.find(season => season.urlName === seasonUrlName);
	if (!season) {
		res.status(404);
		return next(new Error('No anime found'));
	}

	// Update hasUpdates field on anime and season
	// and update anime, season and episode's watchStatus
	let animeHasNewEpisodes = false;
	let hasWatchAllAnimeEpisodes = true;

	for (const _season of anime.seasons) {
		let seasonHasNewEpisodes = false;
		let hasWatchedAllSeasonEpisodes = true;

		for (const _part of _season.parts) {
			for (const _episode of _part.episodes) {

				// If it's the episode we're looking for
				if (_episode.urlName === episodeUrlName) {
					if (hasWatched !== undefined) {
						_episode.hasWatched = hasWatched;
						_episode.isNew = false;
					}

					if (isFavorite !== undefined) {
						_episode.isFavorite = isFavorite;
					}
				}

				if (_episode.isNew) {
					animeHasNewEpisodes = true;
					seasonHasNewEpisodes = true;
				}

				if (!_episode.hasWatched) {
					hasWatchAllAnimeEpisodes = false;
					hasWatchedAllSeasonEpisodes = false;
				}
			}
		}


		season.hasWatched = !season.isAiring && hasWatchedAllSeasonEpisodes;
		season.hasNewEpisodes = seasonHasNewEpisodes;
	}

	anime.hasWatched = !anime.isAiring && hasWatchAllAnimeEpisodes;
	anime.hasNewEpisodes = animeHasNewEpisodes;

	const savedAnime = await anime.save();
	res.status(200);
	res.json(savedAnime);
});


export default router;