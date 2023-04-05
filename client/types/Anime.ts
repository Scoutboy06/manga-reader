export default interface Anime {
	title: string;
	description: string;
	urlName: string;
	tmdbId: number;
	isAiring: boolean;
	mediaType: 'tv' | 'movie';

	seasons: [
		{
			name: string;
			urlName: string;
			description: string;
			tmdbId: number;
			isAiring: boolean;
			poster: {
				small?: string;
				large?: string;
			};
			parts: [
				{
					number: number;
					sourceUrlName: string;
					isAiring: boolean;
					episodes: [
						{
							number: number;
							urlName: string;
							sourceUrlName: string;
						}
					];
				}
			];
		}
	];

	genres?: string;
	released?: string;
	otherNames?: string;
	poster: {
		small?: string;
		large?: string;
	};
	backdrop: {
		small?: string;
		large?: string;
	};
}
