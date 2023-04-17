import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongoose';
import Manga from '@/models/Manga.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]';
import User from '@/models/User.model';
import { UserManga } from '@/types/User';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	const mangaUrlName = req.query.urlName!;
	const chapterUrlName: string = req.body.urlName;

	const session = await getServerSession(req, res, authOptions);
	if (!session?.user) return res.status(401).json({ message: 'Unauthorized' });

	const [user, manga] = await Promise.all([
		User.findById(session.user._id),
		Manga.findOne({ urlName: mangaUrlName }),
	]);

	if (!user) return res.status(401).json({ message: 'User not found' });
	if (!user.mangas)
		return res.status(401).json({ message: 'User has no mangas' });
	if (!manga) return res.status(404).json({ message: 'Manga not found' });

	const currentChapter = manga.chapters.find(
		chapter => chapter.urlName === chapterUrlName
	);
	if (!currentChapter)
		return res.status(404).json({ message: 'Chapter not found' });

	const userManga = user.mangas.find(manga => manga.urlName === mangaUrlName);

	if (!userManga) {
		const mangaMeta: UserManga = {
			_id: manga._id,
			urlName: manga.urlName,
			title: manga.title,
			isFavorite: false,
			notificationsOn: true,
			readStatus: 'reading',
			lastRead: new Date(),
			currentChapter,
			poster: manga.poster,
		};

		user.mangas.unshift(mangaMeta);
	} else {
		userManga.currentChapter = currentChapter;
		userManga.lastRead = new Date();
	}

	user.mangas.sort(
		(mangaA, mangaB) => mangaB.lastRead.getTime() - mangaA.lastRead.getTime()
	);

	await user.save();
	res.status(200).json({ message: 'Success' });
}
