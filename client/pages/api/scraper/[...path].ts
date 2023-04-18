import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongoose';
import fetchScraper from '@/lib/fetchScraper';

const { SCRAPER_URI } = process.env;

if (!SCRAPER_URI) {
	throw new Error('Please add `SCRAPER_URI` to .env.local');
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	const { path, ...params } = req.query;

	const url = Array.isArray(path) ? path.join('/') : path || '';

	try {
		const data = await fetchScraper({
			method: req.method,
			url,
			params,
			data: req.query.body,
		});
		res.status(data.status).json(data.data);
	} catch (err) {
		res.status(err.status || 500).json(err);
	}
}
