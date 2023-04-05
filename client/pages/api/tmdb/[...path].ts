import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { path } = req.query;

	const data = await fetch(
		`https://api.themoviedb.org/3/${path}?` +
			new URLSearchParams({
				api_key: process.env.TMDB_V3_API_KEY,
				...req.query,
			})
	).then(res => res.json());

	res.json(data);
}
