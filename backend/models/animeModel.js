import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		urlName: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		genres: { type: String, required: true },
		released: { type: String, required: true },
		status: { type: String, required: true },
		otherNames: { type: String, required: true },
		episodes: [
			{
				number: { type: Number, required: true },
				urlName: { type: String, required: true },
				status: { type: String, default: '' },
			},
		],
		isFavorite: { type: Boolean, default: false },
		hasWatched: { type: Boolean, default: false },
		notificationsOn: { type: Boolean, default: false },
		images: {
			posters: [
				{
					width: { type: Number, required: true },
					height: { type: Number, required: true },
					url: { type: String, required: true },
					deleteUrl: { type: Number, required: true },
				},
			],
			backdrops: [
				{
					width: { type: Number, required: true },
					height: { type: Number, required: true },
					url: { type: String, required: true },
					deleteUrl: { type: Number, required: true },
				},
			],
		},
	},
	{
		timestamps: true,
	}
);

const Anime = mongoose.model('Anime', MODEL_NAME);

export default Anime;
