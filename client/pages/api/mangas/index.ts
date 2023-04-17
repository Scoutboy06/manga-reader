import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/lib/mongoose';
import Manga from '@/models/Manga.model';
import { Chapter } from '@/types/Manga';
import fetchScraper from '@/lib/fetchScraper';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	switch (req.method) {
		case 'GET':
			return GET(req, res);
		case 'POST':
			return POST(req, res);
		default:
			res.status(404).end();
	}
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
	const { limit = 50, skip = 0, query = '' } = req.query;

	const mangas = await Manga.find(
		{
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
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
	const { hostId, sourceUrlName } = req.body;

	try {
		const response = await fetchScraper({
			url: '/mangas/external',
			params: {
				sourceUrlName,
				hostId,
			},
		});

		const chapters: Chapter[] = response.data.chapters;

		const newManga = await Manga.create({
			...req.body,
			chapters,
		});
		res.status(201).json(newManga);
	} catch (err) {
		res.status(400).json(err);
	}
}
