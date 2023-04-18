import { Types } from 'mongoose';

export interface Chapter {
	number: number;
	urlName: string;
	sourceUrlName: string;
	dateAdded: Date | string;
}

export interface NewManga {
	urlName: string;
	title: string;
	description: string;
	sourceUrlName: string;

	hostId: Types.ObjectId | string;

	airStatus: 'ongoing' | 'completed';

	chapters: Chapter[];
	latestChapterAt: Date | string;

	otherNames?: string;
	authors?: string;
	artists?: string;
	genres?: string;
	released?: string;

	poster: string;
	backdrop?: string;

	createdAt: Date | string;
}

export default interface IManga extends NewManga {
	_id: Types.ObjectId;

	popular?: boolean;
	popularIndex?: number;
	top100Index?: number;
}
