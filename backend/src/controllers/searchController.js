import { Router } from 'express';
import handler from 'express-async-handler';

import Manga from '../models/mangaModel.js';
import Anime from '../models/animeModel.js';
import Host from '../models/hostModel.js';

import getMangaMeta from '../functions/manga/getMetadata.js';

const router = Router();

// @desc	Search for new manga or anime
// @route	GET /search
router.get('/search', handler(async (req, res) => {
	const { type, query, urlName, hostId } = req.query;

	// /search?type=manga
	if (type === 'manga') {
		if (query) {
			const manga = await Manga.find({
				isVerified: true,
				title: {
					$regex: query,
					$options: 'i'
				}
			}, {
				chapters: 0,
			});

			return res.json(manga);
		}

		else if (urlName && hostId) {
			const host = await Host.findById(hostId);
			const manga = await getMangaMeta({ urlName, host });
			return res.json(manga);
		}
	}

	// /search?type=anime
	else if (type === 'anime') {
		const anime = await Anime.find({
			isVerified: true,
			title: {
				$regex: query,
				$options: 'i'
			}
		}, {
			seasons: 0,
		});

		return res.json(anime);
	}

	res.status(400);
	throw new Error('Invalid query');
}));




export default router;