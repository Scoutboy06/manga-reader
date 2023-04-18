import connectDB from '@/lib/mongoose';
import Manga from '@/models/Manga.model';
import { GetServerSideProps } from 'next';

export default function Random() {
	return null;
}

export const getServerSideProps: GetServerSideProps = async context => {
	await connectDB();
	const randomManga = await Manga.aggregate([{ $sample: { size: 1 } }]);

	return {
		redirect: {
			destination: `/mangas/${randomManga[0].urlName}`,
			permanent: false,
		},
	};
};
