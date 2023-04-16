import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongoose';
import Manga from '@/models/Manga.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]';
import User from '@/models/User.model';
import { UserManga } from '@/types/User';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	await connectDB();
	const mangaUrlName = req.query.urlName;
	const chapterUrlName = req.body.urlName;

	const session = await getServerSession(req, res, authOptions);
	if (!session?.user) return res.status(401).json({ message: 'Unauthorized' });

	const [user, manga] = await Promise.all([
		User.findById(session.user._id),
		Manga.findOne({ urlName: mangaUrlName }),
	]);

	if (!user) return res.status(401).json({ message: 'User not found' });
	if (!manga) return res.status(404).json({ message: 'Manga not found' });

	const chapter = manga.chapters.find(
		chapter => chapter.urlName === chapterUrlName
	);
	if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

	const userManga = user
		.toObject()
		.mangas.find(manga => manga.urlName === mangaUrlName);

	if (!userManga) {
		const mangaMeta: UserManga = {
			urlName: manga.urlName,
			title: manga.title,
			isFavorite: false,
			notificationsOn: true,
			readStatus: 'reading',
			lastRead: new Date(),
			currentChapter: chapter,
			poster: manga.poster,
		};

		user.mangas.unshift(mangaMeta);
	} else {
		userManga.currentChapter = chapter;

		// Place manga first in library
		const userMangaIndex = user.mangas.findIndex(
			manga => manga._id === userManga._id
		);
		// user.mangas.unshift(userManga);
		// user.mangas.splice(userMangaIndex + 1, 1);
		console.log(user.mangas[userMangaIndex]);
	}

	await user.save();
	res.status(200).json({ message: 'Success' });
}
