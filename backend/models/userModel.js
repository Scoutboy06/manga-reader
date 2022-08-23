import mongoose from 'mongoose';

const MODEL_NAME = mongoose.Schema(
	{
		name: { type: String, required: true },
		imageUrl: { type: String, required: true },
		discordUserId: { type: String, required: false },
	},
	{
		timestamps: true,
	},
);

const User = mongoose.model('User', MODEL_NAME);

export default User;