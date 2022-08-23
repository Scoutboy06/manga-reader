import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		tmdbId: Number,
		urlName: { type: String, required: true },

		title: { type: String, required: true },
		description: { type: String, required: true },
		mediaType: String,

		seasons: [
			{
				name: { type: String, required: true },
				seasonNumber: { type: Number, required: true },
				id: { type: Number, required: true },
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
				_id: false,
			}
		],
		seasonNumber: Number,

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
				_id: false,
			},
		],

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
