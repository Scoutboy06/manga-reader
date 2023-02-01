import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
	{
		email: { type: String, required: true },
		password: { type: String, required: true },
		name: { type: String, required: true },
		// Change to username?
		imageUrl: { type: String, required: true },
		discordUserId: { type: String, required: false },
	},
	{
		timestamps: true,
	},
);

UserSchema.pre('save', function (next) {
	const user = this;

	if (!user.isModified('password')) return next();
})

const User = mongoose.model('User', UserSchema);

export default User;