import IUser from '../types/User.js';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema<IUser>({
	isAdmin: Boolean,
	name: String,
	email: String,
	image: String,

	mangas: [
		{
			_id: { type: Schema.Types.ObjectId, ref: 'Manga', required: true },
			urlName: { type: String, required: true },
			title: { type: String, required: true },

			isFavorite: { type: Boolean, defualt: false },
			notificationsOn: { type: Boolean, default: false },
			readStatus: {
				type: String,
				enum: ['reading', 'finished'],
				default: 'reading',
			},
			lastRead: { type: Date, required: true },

			currentChapter: {
				number: { type: Number, required: true },
				urlName: { type: String, required: true },
				sourceUrlName: { type: String, required: true },
			},

			poster: { type: String, required: true },
		},
	],

	notifications: [
		{
			title: { type: String, required: true },
			body: String,
			image: String,
			action: { type: String, required: true },
			createdAt: { type: Date, required: true },
		},
	],
});

const User = model('User', UserSchema);

export default User;
