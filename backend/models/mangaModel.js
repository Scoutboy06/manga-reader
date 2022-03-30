import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		name: { type: String, required: true },
		urlName: { type: String, required: true },
		chapter: { type: String, required: true },
		subscribed: { type: Boolean, required: false, default: false },
		hostId: { type: mongoose.Types.ObjectId, ref: 'Host', required: true },
		coverUrl: { type: String, required: true },
		finished: { type: Boolean, required: false, default: false },
		ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
	},
	{
		timestamps: false,
	}
);

const Manga = mongoose.model('Manga', MODEL_NAME);

export default Manga;
