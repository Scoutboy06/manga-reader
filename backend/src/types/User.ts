import { Types } from 'mongoose';

export default interface IUser {
	_id: string;
	isAdmin: boolean;
	name: string;
	image: string;
	discordUserId?: string;

	mangas?: [
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

	animes?: [
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
