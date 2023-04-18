import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongoose';
import Manga from '@/models/Manga.model';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	switch (req.method) {
		case 'GET':
			return GET(req, res);
		case 'PUT':
			return PUT(req, res);
		default:
			res.status(404).end();
	}
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
	const mangas = await Manga.find(
		{ popularIndex: { $exists: true } },
		{ chapters: { $slice: [0, 3] }, title: 1, urlName: 1, poster: 1 }
	);
	res.json(mangas);
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
	const ids: string[] = req.body;

	if (!Array.isArray(ids))
		return res
			.status(400)
			.json({ message: 'Invalid data: request body is not a valid array' });

	// Clear all featured mangas
	await Manga.updateMany(
		{ popularIndex: { $exists: true } },
		{ $unset: { popularIndex: '' } }
	);
	// Set featured that were added
	const popularMangas = await Manga.find({ _id: { $in: ids } });

	const updated = await Promise.all(
		popularMangas.map(async manga => {
			manga.popularIndex = ids.findIndex(id => id === manga._id.toString());
			return await manga.save();
		})
	);

	res
		.status(200)
		.json({ message: `Sucessfully set ${updated.length} popular mangas` });
}
