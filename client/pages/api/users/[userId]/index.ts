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
		case 'PUT':
			return PUT(req, res);
		case 'DELETE':
			return DELETE(req, res);
		default:
			res.status(404).end();
	}
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
	const { userId } = req.query;

	const user = await User.findById(userId);
	res.json(user);
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
	const user = new User(req.body);
	const createdUser = await user.save();
	res.status(201).json(createdUser);
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
	const { userId } = req.query;
	const status = await User.deleteOne({ _id: userId });

	if (status.acknowledged)
		res.status(200).json({ message: 'Successfully removed document' });
	else res.status(404).json({ message: 'Document not found' });
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
	const { userId } = req.query;
	const user = await User.findOneAndUpdate({ _id: userId }, req.body);

	if (user) res.json(user);
	else res.status(404).json({ message: 'Document not found' });
};
