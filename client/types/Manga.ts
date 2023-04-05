import { Types } from 'mongoose';

export default interface IManga {
	isVerified: boolean;
	title: string;
	description: string;
	urlName: string;
	sourceUrlName: string;
	hostId: Types.ObjectId;
	airStatus: 'ongoing' | 'completed';
	chapters: [
		{
			title: string;
			number: number;
			urlName: string;
			sourceUrlName: string;
		}
	];
	otherNames?: string;
	authors?: string;
	artists?: string;
	genres?: string;
	released?: string;
	poster: string;
	backdrop?: string;
}
