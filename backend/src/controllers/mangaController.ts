import mongoose from 'mongoose';
import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import handler from 'express-async-handler';

import Manga from '../models/mangaModel.js';
import Host from '../models/hostModel.js';
import User from '../models/userModel.js';

import getMangaMeta from '../functions/manga/getMetadata.js';
import parseUrlName from '../functions/parseUrlName.js';

const router = Router();

// @desc	Get all of the user's mangas
router.get(
	'/users/:userId/mangas',
	handler(async (req: Request, res: Response) => {
		const { userId } = req.params;
		const { limit = Infinity } = req.query;

		const user = await User.findById(
			userId,
			{
				mangas: {
					$slice: [0, Number(limit)],
				},
			},
			{
				mangas: 1,
			}
		);

		if (!user) {
			res.status(404);
			throw new Error('User not found');
		}

		res.json(user.mangas);
	})
);

router.get(
	'/mangas',
	handler(async (req: Request, res: Response) => {
		const { limit = 50, skip = 0, query = '' } = req.query;

		const mangas = await Manga.find(
			{
				isVerified: true,
				$or: [
					{
						title: {
							$regex: query,
							$options: 'i',
						},
					},
					{
						otherNames: {
							$regex: query,
							$options: 'i',
						},
					},
				],
			},
			{
				chapters: 0,
			}
		)
			.limit(Number(limit))
			.skip(Number(skip));

		res.json(mangas);
	})
);

router.get(
	'/mangas/featured',
	handler(async (req: Request, res: Response) => {
		const mangaIds = [
			'63f7e42563c61bcace96d7f1', // Solo Leveling
			'63f9f34bbfb94d355de10a1d', // One Punch Man
			'63fa44e37c653625db5bb11d', // Mushoku Tensei
			'6415d66a5a465065c30fb8a7', // Berserk
			'63fa439e7c653625db5bb108', // Spy x Family
			'63fa421f7c653625db5bb0f1', // Kaguya-sama
			'63fa43d07c653625db5bb10c', // Chainsaw man
			'63fa459e7c653625db5bb122', // My Dress-Up Darling
		];

		const mangas = await Manga.find(
			{ _id: { $in: mangaIds } },
			{ chapters: 0 }
		);

		res.json(mangas);
	})
);

// @desc	Get metadata from an external source
router.get(
	'/mangas/external',
	handler(async (req: Request, res: Response) => {
		const url = new URL(req.query.url as string);
		const urlName = url.pathname.split('/')[2];

		const host = await Host.findOne({ name: url.host });
		const manga = await getMangaMeta({ urlName, host });

		res.json({
			...manga,
			sourceUrlName: urlName,
			urlName: parseUrlName(manga.title),
			hostId: host._id,
			airStatus: manga.airStatus,
		});
	})
);

// @desc	Get a manga by it's urlName
router.get(
	'/mangas/:urlName',
	handler(async (req: Request, res: Response) => {
		const { urlName } = req.params;
		const manga = await Manga.findOne({ urlName });
		res.json(manga);
	})
);

// @desc	Get a manga by name
router.get(
	'/users/:userId/mangas/:mangaName',
	handler(async (req: Request, res: Response) => {
		const { userId, mangaName } = req.params;

		const manga = await Manga.findOne({ ownerId: userId, urlName: mangaName });

		res.json(manga);
	})
);

// @desc	Create a new manga+
router.post(
	'/mangas',
	handler(async (req: Request, res: Response) => {
		const { title, hostId, sourceUrlName } = req.body;

		const host = await Host.findById(hostId);
		const { chapters } = await getMangaMeta({ urlName: sourceUrlName, host });

		const urlName = parseUrlName(title);

		const manga = new Manga({
			isVerified: req.body.isVerified || true,
			title: req.body.title,
			description: req.body.description,
			urlName,
			sourceUrlName: req.body.sourceUrlName,
			hostId,
			airStatus: req.body.airStatus,
			// ownerId: req.body.userId,
			chapters,
			otherNames: req.body.otherNames,
			authors: req.body.authors,
			artists: req.body.artists,
			genres: req.body.genres,
			released: req.body.released,
			poster: req.body.poster,
		});

		const createdManga = await manga.save();

		res.status(201).json(createdManga);
	})
);

// @desc	Add the manga to the user's library (if not there) and update the current chapter
router.post(
	'/users/:userId/mangas/:mangaId/currentChapter',
	handler(async (req, res, next) => {
		const { userId, mangaId } = req.params;
		const { urlName: chapterUrlName } = req.body;

		const user = await User.findById(userId, { animes: 0 });
		const manga = await Manga.findById(mangaId);

		// The chapter the user is currently on
		const currentChapter = manga.chapters.find(
			chapter => chapter.urlName === chapterUrlName
		);

		const userManga = user.mangas.find(
			manga => manga._id.toString() === mangaId
		);
		if (userManga) {
			// Update the current chapter
			userManga.currentChapter = currentChapter;
			userManga.lastRead = new Date();
			user.mangas.sort((a, b) => Number(b.lastRead) - Number(a.lastRead));
		} else {
			// Add manga to the user's library
			user.mangas.unshift({
				_id: manga._id,
				urlName: manga.urlName,
				title: manga.title,
				currentChapter,
				lastRead: new Date(),
				poster: manga.poster,
				isFavorite: false,
				notificationsOn: false,
				readStatus: 'reading',
			});
		}

		await user.save();
		res.json({ status: 'success' });
	})
);

// @desc	Get images from a chapter
router.get(
	'/mangas/:urlName/:chapter',
	handler(async (req: Request, res: Response) => {
		const { urlName, chapter } = req.params;

		const manga = await Manga.findOne({ urlName });

		const currentChapter = manga.chapters.find(ch => ch.urlName === chapter);

		const host = await Host.findById(manga.hostId);
		const url = host.chapterPage.url
			.replace('%name', manga.sourceUrlName)
			.replace('%chapter', currentChapter.sourceUrlName);

		const html = await fetch(url, { redirect: 'follow' }).then(res =>
			res.text()
		);
		const document = parse(html);

		const imageEls = document.querySelectorAll(host.chapterPage.images);
		const srcs = [];

		for (const img of imageEls) {
			let src =
				img.getAttribute('data-src') ||
				img.getAttribute('data-setsrc') ||
				img.getAttribute('src');

			src = src.trim();
			srcs.push(src);
		}

		if (srcs.length === 0) {
			res.status(404);
			throw new Error('No images found');
		}

		res.json({
			title: currentChapter.title,
			number: currentChapter.number,
			images: srcs,
			originalUrl: url,
		});
	})
);

export default router;
