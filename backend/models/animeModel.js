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
				description: { type: String, default: '' },
				tmdbId: { type: Number, required: true },
				status: { type: String, required: true },
				watchStatus: { type: String, default: '' },
				poster: {
					small: String,
					large: String,
				},
				parts: [
					{
						number: { type: Number, required: true },
						sourceUrlName: { type: String, required: true },
						status: { type: String, required: true },
						episodes: [
							{
								number: { type: Number, required: true },
								urlName: { type: String, required: true },
								sourceUrlName: { type: String, required: true },
								watchStatus: { type: String, default: '' },
							},
						],
						_id: false,
					}
				],
				hasUpdates: { type: Boolean, default: false },
				_id: false,
			}
		],
		currentSeasonId: mongoose.Types.ObjectId,
		currentPartIndex: Number,
		currentEpisodeId: mongoose.Types.ObjectId,

		genres: { type: String, required: true },
		released: { type: String, required: true },
		status: { type: String, required: true },
		watchStatus: { type: String, default: '' },
		otherNames: { type: String, required: true },

		isFavorite: { type: Boolean, default: false },
		hasWatched: { type: Boolean, default: false },
		notificationsOn: { type: Boolean, default: false },
		hasUpdates: { type: Boolean, default: false },

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
