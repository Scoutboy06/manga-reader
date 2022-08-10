import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		_id: { type: String, required: true }, // _id === urlName
		imgUrl: { type: String, required: true },
		title: { type: String, required: true },
		desciption: { type: String, required: true },
		misc: {
			genres: String,
			released: String,
			status: String,
			otherNames: String,
		},
		episodes: [
			{
				number: { type: Number, required: true },
				urlName: { type: String, required: true },
				status: { type: String, required: false, default: '' }
			}
		],
	},
	{
		timestamps: true,
	}
);

const Anime = mongoose.model('Anime', MODEL_NAME);

export default Anime;
