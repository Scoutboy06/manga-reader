import { Types } from 'mongoose';
import Notification from './Notification.js';

export default interface IUser {
	_id: Types.ObjectId | string;
	isAdmin?: boolean;
	name?: string | null;
	email?: string | null;
	image?: string | null;

	mangas: [
		{
			_id: Types.ObjectId | string;
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

	notifications: Notification[];
}
