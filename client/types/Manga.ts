import { Types } from 'mongoose';

export interface Chapter {
	number: number;
	urlName: string;
	sourceUrlName: string;
	dateAdded: Date | string;
}

export interface DefaultManga {
	urlName: string;
	title: string;
	description: string;
	sourceUrlName: string;

	airStatus?: 'ongoing' | 'completed';
	otherNames?: string;
	authors?: string;
	artists?: string;
	genres?: string;
	released?: string;

	poster: string;

	chapters: Chapter[];
}

export interface NewManga extends DefaultManga {
	hostId: Types.ObjectId | string;
	latestChapterAt: Date | string;

	createdAt: Date | string;
}

export default interface IManga extends NewManga {
	_id: Types.ObjectId;

	backdrop?: string;

	featuredIndex?: number;
	popularIndex?: number;
	top100Index?: number;
}
