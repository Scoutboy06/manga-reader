import { Schema, Types, model } from 'mongoose';

export interface IUser {
	name: string;
	password?: string;
	isAdmin: boolean;
	profilePicture: string;
	discordUserId?: string;

	mangas: [
		{
			_id: Types.ObjectId;
			urlName: string;
			title: string;
			isFavorite: boolean;
			notificationsOn: boolean;
			readStatus: 'reading' | 'finished';
			lastRead: Date;
			currentChapter: {
				title: string;
				number: number;
				urlName: string;
				sourceUrlName: string;
			};
			poster: string;
		}
	];

	animes: [
		{
			_id: Types.ObjectId;
			urlName: string;
			isFavorite: boolean;
			notificationsOn: boolean;
			watchStatus: 'watching' | 'finished';
			seasons: [
				{
					urlName: string;
					episodes: [
						{
							number: number;
							isNew: boolean;
							hasWatched: boolean;
							isFavorite: boolean;
						}
					];
				}
			];
			currentSeason: {
				name: string;
				urlName: string;
			};
			currentEpisode: {
				number: number;
				urlName: string;
			};
		}
	];
}

const UserSchema = new Schema<IUser>({
	name: { type: String, required: true },
	password: String,
	isAdmin: { type: Boolean, default: false },

	profilePicture: { type: String, required: true },
	discordUserId: String,

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
				title: { type: String, required: true },
				number: { type: Number, required: true },
				urlName: { type: String, required: true },
				sourceUrlName: { type: String, required: true },
			},

			poster: { type: String, required: true },
		},
	],

	animes: [
		{
			_id: { type: Schema.Types.ObjectId, ref: 'Anime', required: true },
			urlName: { type: String, required: true },
			isFavorite: { type: Boolean, defualt: false },
			notificationsOn: { type: Boolean, default: false },
			watchStatus: {
				type: String,
				enum: ['watching', 'finished'],
				default: 'watching',
			},

			seasons: [
				{
					_id: false,
					urlName: { type: String, required: true },

					episodes: [
						{
							_id: false,
							number: { type: Number, required: true },
							isNew: { type: Boolean, required: true },
							hasWatched: { type: Boolean, default: false },
							isFavorite: { type: Boolean, default: false },
						},
					],
				},
			],

			currentSeason: {
				name: { type: String, required: true },
				urlName: { type: String, required: true },
			},

			currentEpisode: {
				number: { type: Number, required: true },
				urlName: { type: String, required: true },
			},
		},
	],

	// notifications: []
});

const User = model('User', UserSchema);

export default User;
