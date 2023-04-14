import { Types } from 'mongoose';
import Notification from './Notification.js';
import { AdapterUser } from 'next-auth/adapters.js';

export default interface IUser extends AdapterUser {
	_id?: Types.ObjectId | string;
	isAdmin?: boolean;

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

	notifications?: Notification[];
}
