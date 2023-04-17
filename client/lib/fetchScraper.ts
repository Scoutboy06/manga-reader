import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongoose';
import axios, { AxiosRequestConfig } from 'axios';

const { SCRAPER_URI } = process.env;

if (!SCRAPER_URI) {
	throw new Error('Please add `SCRAPER_URI` to .env.local');
}

export default async function fetchScraper(config: AxiosRequestConfig<any>) {
	await connectDB();
	return await axios({
		...config,
		baseURL: SCRAPER_URI,
	});
}
