const { SCRAPER_URI } = process.env;

if (!SCRAPER_URI) {
	throw new Error('Please add SCRAPER_URI in .env.local');
}

export default {
	async redirects() {
		return [
			{
				source: '/',
				destination: '/mangas',
				permanent: true,
			},
		];
	},
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'manga-reader-scoutboy06.vercel.app' },
			{ protocol: 'https', hostname: 'www.themoviedb.org' },
			{ protocol: 'https', hostname: 'image.tmdb.org' },
			{ protocol: 'https', hostname: 'images.fanart.tv' },
			{ protocol: 'https', hostname: 'lh3.googleusercontent.com' },
		],
	},
	rewrites: () => {
		return [
			{
				source: '/api/mangas/external',
				destination: new URL('/mangas/external', SCRAPER_URI).href,
			},
		]
	}
};

