import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		tmdbId: Number,
		urlName: { type: String, required: true },
		gogoUrlName: { type: String, required: true },

		title: { type: String, required: true },
		description: { type: String, required: true },
		mediaType: String,
		season: { type: Number, required: true },

		genres: { type: String, required: true },
		released: { type: String, required: true },
		status: { type: String, required: true },
		otherNames: { type: String, required: true },

		isFavorite: { type: Boolean, default: false },
		hasWatched: { type: Boolean, default: false },
		notificationsOn: { type: Boolean, default: false },

		episodes: [
			{
				number: { type: Number, required: true },
				urlName: { type: String, required: true },
				status: { type: String, default: '' },
			},
		],

		poster: {
			small: {
				url: String,
				public_id: String,
			},
			large: {
				url: String,
				public_id: String,
			}
		},
		backdrop: {
			small: {
				url: String,
				public_id: String,
			},
			large: {
				url: String,
				public_id: String,
			}
		}
	},
	{
		timestamps: true,
	}
);

const Anime = mongoose.model('Anime', MODEL_NAME);

export default Anime;
