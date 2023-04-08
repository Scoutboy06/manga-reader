import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/lib/mongodb';
import Manga from '@/models/mangaModel';

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
	const manga = new Manga(req.body);
	const savedManga = await manga.save();
	if (savedManga) res.status(201).json(savedManga);
	else res.status(400).json({ message: 'Invalid fields' });
}
