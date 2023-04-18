import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongoose';
import User from '@/models/User.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	switch (req.method) {
		case 'GET':
			return GET(req, res);
		case 'DELETE':
			return DELETE(req, res);
		default:
			res.status(404).end();
	}
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session?.user) return res.status(401).json({ message: 'Unauthorized' });

	const user = await User.findById(session.user._id, { notifications: 1 });
	if (!user) return res.status(404).json({ message: 'User not found' });

	res.json(user.notifications?.reverse());
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session?.user) return res.status(401).json({ message: 'Unauthorized' });

	const status = await User.updateOne(
		{ _id: session.user._id },
		{ $set: { notifications: [] } }
	);
	res.json(status);
};
