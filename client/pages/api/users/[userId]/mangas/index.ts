import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import connectDB from '@/lib/mongodb';
import User from '@/models/userModel';

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
	const { userId, limit = 50, skip = 0 } = req.query;

	const token = await getToken({ req });
	if (!token) return res.status(401).json({ message: 'Not authorized' });

	const user = await User.findOne(
		{ _id: userId },
		{
			mangas: {
				// Start and end number, for pagination
				$slice: [Number(skip), Number(skip) + Number(limit)],
			},
		}
	);

	if (!user) res.status(404).json({ message: 'User not found' });
	else res.json(user.mangas);
}
