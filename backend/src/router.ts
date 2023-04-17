import { Request, Response, Router } from 'express';
import Host from './models/hostModel.js';
import scrapeManga from './lib/scrapeManga.js';
import matchValueWithSchema from './lib/matchValueWithSchema.js';
import { HydratedDocument } from 'mongoose';
import IHost from './types/Host.js';
import Manga from './models/mangaModel.js';
import scrapeImages from './lib/scrapeImages.js';

const router = Router();

router.get('/mangas/external', async (req: Request, res: Response) => {
	const { hostId } = req.query;
	let host: HydratedDocument<IHost>;
	let sourceUrlName = req.query.sourceUrlName?.toString();

	if (sourceUrlName && hostId) {
		host = await Host.findById(hostId);
		if (!host) return res.status(404).json({ message: 'Host not found' });
	} else {
		if (!req.query.url)
			return res.status(400).json({ message: `Invalid value 'url' in query` });

		const url = new URL(req.query.url.toString());

		host = await Host.findOne({ name: url.hostname });
		if (!host) return res.status(404).json({ message: 'No host found' });

		sourceUrlName = matchValueWithSchema({
			value: url.href,
			schema: host.detailsPage.urlPattern,
		}).get('name');
	}

	if (!sourceUrlName)
		return res.status(400).json({ message: `Could not find sourceUrlName` });

	try {
		const mangaMeta = await scrapeManga(sourceUrlName, host, false);
		res.json(mangaMeta);
	} catch (err) {
		res.status(500).json({ message: err.toString() });
		console.error(err.toString());
	}
});

router.get('/mangas/:urlName/:chapter', async (req: Request, res: Response) => {
	const { urlName, chapter } = req.params;

	const manga = await Manga.findOne(
		{ urlName },
		{
			chapters: 1,
			hostId: 1,
			sourceUrlName: 1,
		}
	);
	if (!manga) return res.status(404).json({ message: 'Manga not found' });

	const currChap = manga
		.toObject()
		.chapters.find(chap => chap.urlName === chapter);
	if (!currChap) return res.status(404).json({ message: 'Chapter not found' });

	const host = await Host.findById(manga.hostId);
	if (!host) return res.status(500).json({ message: 'Host not found' });

	const images = await scrapeImages(
		manga.sourceUrlName,
		currChap.sourceUrlName,
		host
	);

	res.json({
		...currChap,
		images,
	});
});

// router.use('/test', async (req: Request, res: Response) => {

// });

export default router;
