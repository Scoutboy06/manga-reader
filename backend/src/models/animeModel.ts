import { Schema, model } from 'mongoose';

export interface IAnime {
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

const MODEL_NAME = new Schema<IAnime>({
	title: { type: String, required: true },
	description: { type: String, required: true },
	urlName: { type: String, required: true },
	tmdbId: Number,
	isAiring: { type: Boolean, required: true },
	mediaType: String, // 'tv' or 'movie'

	seasons: [
		{
			_id: false,
			name: { type: String, required: true },
			urlName: { type: String, required: true },
			description: { type: String, default: '' },
			tmdbId: { type: Number, required: true },
			isAiring: { type: Boolean, required: true },

			poster: {
				small: String,
				large: String,
			},

			parts: [
				{
					_id: false,
					number: { type: Number, required: true },
					sourceUrlName: { type: String, required: true },
					isAiring: { type: Boolean, required: true },

					episodes: [
						{
							_id: false,
							number: { type: Number, required: true },
							urlName: { type: String, required: true },
							sourceUrlName: { type: String, required: true },
						},
					],
				},
			],
		},
	],

	genres: String,
	released: String,
	otherNames: String,

	poster: {
		small: String,
		large: String,
	},
	backdrop: {
		small: String,
		large: String,
	},
});

const Anime = model('Anime', MODEL_NAME);

export default Anime;
