import { Types } from 'mongoose';
import Notification from './Notification.js';
import { AdapterUser } from 'next-auth/adapters.js';
import { Chapter } from './Manga.js';

export interface UserManga {
	_id?: Types.ObjectId | string;
	urlName: string;
	title: string;
	isFavorite: boolean;
	notificationsOn: boolean;
	readStatus: 'reading' | 'finished';
	lastRead: Date;
	currentChapter: Chapter;
	poster: string;
}

export default interface IUser extends AdapterUser {
	_id?: Types.ObjectId | string;
	isAdmin?: boolean;

	mangas: UserManga[];

	notifications?: Notification[];
}
