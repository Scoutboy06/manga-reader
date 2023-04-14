import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/lib/mongoose';
import User from '@/models/User.model';

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
	const users = await User.find({}, { mangas: 0, animes: 0 });
	res.json(users);
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
	const user = new User(req.body);
	const createdUser = await user.save();
	if (createdUser) res.status(201).json(createdUser);
}
