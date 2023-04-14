import Head from 'next/head';
import styles from './mangas.module.css';
import AdminLayout from '@/components/layouts/AdminLayout';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]';
import Manga from '@/models/Manga.model';
import IUser from '@/types/User';
import IManga from '@/types/Manga';
import connectDB from '@/lib/mongoose';

type PageProps = {
	totalMangaCount: number;
	ongoingMangaCount: number;
	finishedMangaCount: number;
	totalChapterCount: number;
	featuredMangas: IManga[];
};

export default function Mangas({
	totalMangaCount,
	ongoingMangaCount,
	finishedMangaCount,
	totalChapterCount,
	featuredMangas,
}: PageProps) {
	return (
		<>
			<Head>
				<title>Settings - Mangas</title>
			</Head>

			<AdminLayout
				top={
					<>
						<h1>Mangas</h1>
						<Link
							href='/admin/mangas/new'
							className='btn btn-primary icon-left'
						>
							<i className='icon'>add</i>
							Create new
						</Link>
					</>
				}
			>
				<div className={styles.infoCards}>
					<div className={styles.infoCard}>
						<h1>{totalMangaCount}</h1>
						<p>Total mangas</p>
					</div>
					<div className={styles.infoCard}>
						<h1>{ongoingMangaCount}</h1>
						<p>Ongonig mangas</p>
					</div>
					<div className={styles.infoCard}>
						<h1>{finishedMangaCount}</h1>
						<p>Finished mangas</p>
					</div>
					<div className={styles.infoCard}>
						<h1>{totalChapterCount}</h1>
						<p>Total chapters</p>
					</div>
				</div>
			</AdminLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async context => {
	await connectDB();
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session?.user?.isAdmin) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const [details, ongoingMangaCount, featuredMangas] = await Promise.all([
		Manga.aggregate([
			{
				$group: {
					_id: 1,
					totalMangaCount: {
						$count: {},
					},
					totalChapterCount: {
						$sum: { $size: '$chapters' },
					},
				},
			},
		]),
		Manga.countDocuments({ airStatus: 'ongoing' }),
		Manga.find(
			{ featured: true },
			{ urlName: 1, title: 1, airStatus: 1, poster: 1 }
		),
	]);

	const { totalMangaCount, totalChapterCount } = details[0];
	const finishedMangaCount = totalMangaCount - ongoingMangaCount;

	const props: PageProps = {
		totalMangaCount,
		ongoingMangaCount,
		finishedMangaCount,
		totalChapterCount,
		featuredMangas,
	};

	return { props };
};
