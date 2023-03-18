import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
	name: { type: String, required: true },
	password: String,
	isAdmin: { type: Boolean, default: false },

	profilePicture: { type: String, required: true },
	discordUserId: String,

	mangas: [
		{
			_id: { type: mongoose.Types.ObjectId, ref: 'Manga', required: true },
			urlName: { type: String, required: true },
			title: { type: String, required: true },

			isFavorite: { type: Boolean, defualt: false },
			notificationsOn: { type: Boolean, default: false },
			readStatus: { type: String, enum: ['reading', 'finished'], default: 'reading' },
			lastRead: { type: Date, required: true },

			currentChapter: {
				title: { type: String, required: true },
				number: { type: Number, required: true },
				urlName: { type: String, required: true },
				sourceUrlName: { type: String, required: true },
			},

			poster: { type: String, required: true },
		}
	],

	animes: [{
		_id: { type: mongoose.Types.ObjectId, ref: 'Anime', required: true },
		urlName: { type: String, required: true },
		isFavorite: { type: Boolean, defualt: false },
		notificationsOn: { type: Boolean, default: false },
		watchStatus: { type: String, enum: ['watching', 'finished'], default: 'watching' },

		seasons: [{
			_id: false,
			urlName: { type: String, required: true },

			episodes: [{
				_id: false,
				number: { type: Number, required: true },
				isNew: { type: Boolean, required: true },
				hasWatched: { type: Boolean, default: false },
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