import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/lib/mongoose';
import User from '@/models/User.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]';

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
	const { limit = 50, skip = 0 } = req.query;

	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ message: 'Not authorized' });

	const user = await User.findById(session.user._id, {
		mangas: {
			// For pagination
			$slice: [Number(skip), Number(skip) + Number(limit)],
		},
	});

	if (!user) res.status(404).json({ message: 'User not found' });
	else res.json(user.mangas);
}
