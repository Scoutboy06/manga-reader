import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },

	// imageUrl: { type: String, required: true },
	profilePicture: { type: String, required: true },
	discordUserId: String,

	mangas: [
		{
			_id: { type: mongoose.Types.ObjectId, ref: 'Manga', required: true },
			isFavorite: { type: Boolean, defualt: false },
			notificationsOn: { type: Boolean, default: false },
			readStatus: { type: String, enum: ['reading', 'finished'] },

			readChapters: [mongoose.Types.ObjectId],

			currentChapter: {
				title: { type: String, required: true },
				number: { type: Number, required: true },
				urlName: { type: String, required: true },
				sourceUrlName: { type: String, required: true },
			},
		}
	],

	animes: [{
		_id: { type: mongoose.Types.ObjectId, ref: 'Anime', required: true },
		isFavorite: { type: Boolean, defualt: false },
		notificationsOn: { type: Boolean, default: false },
		watchStatus: { type: String, enum: ['watching', 'finished'], required: true },

		seasons: [{
			_id: false,
			urlName: { type: String, required: true },

			episodes: [{
				_id: false,
				number: { type: Number, required: true },
				hasWatched: { type: Boolean, default: false },
				isNew: { type: Boolean, required: true },
				isFavorite: { type: Boolean, default: false },
			}]
		}],

		currentSeason: {
			name: { type: String, required: true },
			urlName: { type: String, required: true },
		},

		currentEpisode: {
			number: { type: Number, required: true },
			urlName: { type: String, required: true },
		},
	}],

	// notifications: []
});

const User = mongoose.model('User', UserSchema);

export default User;