const { SCRAPER_URI } = process.env;

if (!SCRAPER_URI) {
	throw new Error('Please add SCRAPER_URI in .env.local');
}

export default {
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'manga-reader-scoutboy06.vercel.app' },
			{ protocol: 'https', hostname: 'www.themoviedb.org' },
			{ protocol: 'https', hostname: 'image.tmdb.org' },
			{ protocol: 'https', hostname: 'images.fanart.tv' },
			{ protocol: 'https', hostname: 'cdn.myanimelist.net' },
			{ protocol: 'https', hostname: 'lh3.googleusercontent.com' },
			{ protocol: 'https', hostname: 'www.mangaread.org' },
		],
	},
};

