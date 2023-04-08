import { Types } from 'mongoose';

export default interface IManga {
	_id: string;
	title: string;
	description: string;
	sourceUrlName: string;
	featured: boolean;
	hostId: Types.ObjectId | string;
	airStatus: 'ongoing' | 'completed';
	chapters: {
		title: string;
		number: number;
		urlName: string;
		sourceUrlName: string;
	}[];
	otherNames?: string;
	authors?: string;
	artists?: string;
	genres?: string;
	released?: string;
	poster: string;
	backdrop?: string;
}
