import { Types } from 'mongoose';
import Notification from './Notification.js';
import { Chapter } from './Manga.js';

export interface UserManga {
	_id?: Types.ObjectId | string;
	title: string;
	urlName: string;
	isFavorite: boolean;
	notificationsOn: boolean;
	readStatus: 'reading' | 'finished';
	lastRead: Date;
	currentChapter: Chapter;
	poster: string;
}

export default interface IUser {
	_id: Types.ObjectId | string;
	isAdmin?: boolean;
	name?: string | null;
	email?: string | null;
	image?: string | null;

	mangas: UserManga[];

	notifications: Notification[];
}
