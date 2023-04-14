import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/lib/mongoose';
import User from '@/models/User.model';
import { getToken } from 'next-auth/jwt';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	switch (req.method) {
		case 'GET':
			return GET(req, res);
		default:
			res.status(404).end();
	}
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
	const { userId, mangaId } = req.query;

	const token = await getToken({ req });
	if (!token) return res.status(401).json({ message: 'Not authorized' });

	const user = await User.findOne({ _id: userId }, { 'mangas._id': mangaId });

	if (!user) return res.status(404).json({ message: 'User not found' });
	res.json(user.mangas?.[0]);
}
