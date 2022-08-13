import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		_id: { type: String, required: true }, // _id === urlName
		posterUrl: { type: String, required: true },
		backdrop: String,
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
				status: { type: String, default: '' }
			}
		],
	},
	{
		timestamps: true,
	}
);

const Anime = mongoose.model('Anime', MODEL_NAME);

export default Anime;
