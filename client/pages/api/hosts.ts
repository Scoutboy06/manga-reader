import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/lib/mongoose';
import Host from '@/models/Host.model';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	switch (req.method) {
		case 'POST':
			return POST(req, res);
		default:
			res.status(404).end();
	}
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
	const newHost = await Host.create(req.body);
	if (newHost) res.status(201).json(newHost);
	else res.status(400).json(newHost);
}
