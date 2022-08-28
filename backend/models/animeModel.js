import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		tmdbId: Number,
		urlName: { type: String, required: true },

		title: { type: String, required: true },
		description: { type: String, required: true },
		mediaType: String, // 'tv' or 'movie'

		seasons: [
			{
				name: { type: String, required: true },
				urlName: { type: String, required: true },
				gogoUrlName: { type: String, required: true },
				description: { type: String, required: true },
				id: { type: Number, required: true },
				poster: {
					small: String,
					large: String,
				},
				episodes: [
					{
						number: { type: Number, required: true },
						urlName: { type: String, required: true },
						gogoUrlName: { type: String, required: true },
						status: { type: String, default: '' },
						_id: false,
					},
				],
				_id: false,
			}
		],
		seasonId: Number,

		genres: { type: String, required: true },
		released: { type: String, required: true },
		status: { type: String, required: true },
		otherNames: { type: String, required: true },

		isFavorite: { type: Boolean, default: false },
		hasWatched: { type: Boolean, default: false },
		notificationsOn: { type: Boolean, default: false },

		poster: {
			small: String,
			large: String,
		},
		backdrop: {
			small: String,
			large: String,
		}
	},
	{
		timestamps: true,
	}
);

const Anime = mongoose.model('Anime', MODEL_NAME);

export default Anime;
