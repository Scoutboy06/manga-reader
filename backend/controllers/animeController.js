import asyncHandler from 'express-async-handler';
// import fetch from 'node-fetch';
// import HTMLParser from 'node-html-parser';

import Anime from '../models/animeModel.js';

import getAnimeMeta from '../functions/scrape/getAnimeMeta.js';
import getAnimeEpisode from '../functions/scrape/getAnimeEpisode.js';

// @desc	Create an anime to save in the database
// @route	POST /users/:userId/animes
export const createAnime = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const { urlName } = req.body;
});

// @desc	Get an anime by it's url name
// @route	GET /animes/:_id
export const getAnime = asyncHandler(async (req, res) => {
	const { _id } = req.params;
	const anime = await getAnimeMeta(_id);
	res.json(anime);
});

// @desc	Get metadata about a single episode
// @route	GET /animes/:_id/episode-:episodeNumber
export const getEpisode = asyncHandler(async (req, res) => {
	const { _id, episodeNumber } = req.params;
	const episode = await getAnimeEpisode(_id, Number(episodeNumber));
	res.json(episode);
});

// @desc	Update a saved anime's metadata
// @route	PUT /animes/:animeId
export const updateAnime = asyncHandler(async (req, res) => {
	const { userId, urlName } = req.params;
});

// @desc	Update a saved anime's metadata
// @route	PUT /users/:userId/animes/:animeId
export const deleteAnime = asyncHandler(async (req, res) => {
	const { userId, urlName } = req.params;
});

