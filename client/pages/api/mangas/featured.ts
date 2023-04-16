import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongoose';
import Manga from '@/models/Manga.model';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	switch (req.method) {
		case 'PUT':
			return PUT(req, res);
		default:
			res.status(404).end();
	}
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
	const ids: string[] = req.body;

	if (!Array.isArray(ids))
		return res
			.status(400)
			.json({ message: 'Invalid data: request body is not a valid array' });

	// Clear all featured mangas
	await Manga.updateMany(
		{ featured: true },
		{ $unset: { featured: '', featuredIndex: '' } }
	);
	// Set featured that were added
	const featuredMangas = await Manga.find({ _id: { $in: ids } });

	const updated = await Promise.all(
		featuredMangas.map(async manga => {
			manga.featured = true;
			manga.featuredIndex = ids.findIndex(id => id === manga._id.toString());
			return await manga.save();
		})
	);

	res.status(200).json(updated);
}
