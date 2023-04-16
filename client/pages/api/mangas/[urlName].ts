import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongoose';
import Manga from '@/models/Manga.model';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	const { urlName } = req.query;

	try {
		const manga = await Manga.findOne({ urlName });
		res.json(manga);
	} catch (err) {
		res.status(404).json(err);
	}
}
