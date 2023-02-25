import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema({
	isVerified: { type: Boolean, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	urlName: { type: String, required: true, unique: true },
	sourceUrlName: { type: String, required: true },

	hostId: { type: mongoose.Types.ObjectId, ref: 'Host', required: true },
	ownerId: { type: mongoose.Types.ObjectId, ref: 'User' },

	airStatus: { type: String, enum: ['ongoing', 'completed'], required: true },

	chapters: [
		{
			_id: false,
			title: { type: String, required: true },
			number: { type: Number, required: true },
			urlName: { type: String, required: true },
			sourceUrlName: { type: String, required: true },
		},
	],

	otherNames: String,
	authors: String,
	artists: String,
	genres: String,
	released: String,

	poster: { type: String, required: true },
	backdrop: String,
});

const Manga = mongoose.model('Manga', MODEL_NAME);

export default Manga;
