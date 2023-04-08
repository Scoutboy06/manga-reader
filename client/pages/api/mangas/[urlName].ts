import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/lib/mongodb';
import Manga from '@/models/mangaModel';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	const { urlName } = req.query;

	const manga = await Manga.findOne({ urlName });
	if (manga) res.json(manga);
	else res.status(404).json({ error: 'Not found' });
}
