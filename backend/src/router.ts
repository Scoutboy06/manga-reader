import { Request, Response, Router } from 'express';
import Host from './models/hostModel.js';
import scrapeManga from './lib/scrapeManga.js';
import matchValueWithSchema from './lib/matchValueWithSchema.js';

const router = Router();

router.get('/mangas/external', async (req: Request, res: Response) => {
	if (!req.query.url)
		return res.status(400).json({ message: `Invalid value 'url' in query` });

	const url = new URL(req.query.url.toString());

	const host = await Host.findOne({ name: url.hostname });
	if (!host) return res.status(404).json({ message: 'No host found' });

	const urlName = matchValueWithSchema({
		source: url.href,
		schema: host.detailsPage.url,
		key: '%name',
	});

	if (!urlName)
		return res
			.status(400)
			.json({ message: `Invalid url, couldn't extract field 'urlName'` });

	try {
		const mangaMeta = await scrapeManga(urlName, host, true);
		res.json(mangaMeta);
	} catch (err) {
		res.status(500).json({ message: err.toString() });
		console.error(err.toString());
	}
});

export default router;
