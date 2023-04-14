import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/lib/mongoose';
import User from '@/models/User.model';
import { getToken } from 'next-auth/jwt';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	switch (req.method) {
		case 'GET':
			return GET(req, res);
		case 'DELETE':
			return DELETE(req, res);
		case 'PUT':
			return PUT(req, res);
		default:
			res.status(404).end();
	}
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
	const token = await getToken({ req });
	if (!token?.access_token)
		return res.status(401).json({ message: 'Unauthorized' });

	const user = await User.findOne({ 'auth.access_token': token.access_token });
	res.json(user);
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
	const token = await getToken({ req });
	if (!token?.access_token)
		return res.status(401).json({ message: 'Unauthorized' });

	const status = await User.deleteOne({
		'auth.access_token': token.access_token,
	});

	if (status.acknowledged)
		res.json({ message: 'Successfully removed document' });
	else res.status(404).json({ message: 'Document not found' });
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
	const token = await getToken({ req });
	if (!token?.access_token)
		return res.status(401).json({ message: 'Unauthorized' });

	const user = await User.findOneAndUpdate(
		{ 'auth.access_token': token.access_token },
		req.body
	);

	if (user) res.json(user);
	else res.status(404).json({ message: 'Document not found' });
};
