import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongoose';
import axios from 'axios';

const { SCRAPER_URI } = process.env;

if (!SCRAPER_URI) {
	throw new Error('Please add `SCRAPER_URI` to .env.local');
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	const { path } = req.query;

	const url = Array.isArray(path) ? path.join('/') : path || '';

	try {
		const data = await axios({
			method: req.method,
			baseURL: SCRAPER_URI,
			url,
		});
		res.status(data.status).json(data.data);
	} catch (err) {
		res.status(err.response.status).json(err);
	}
}
