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
	totalMangas: number;
	ongoingMangas: number;
	finishedMangas: number;
	totalChapters: number;
	featuredMangas: IManga[];
};

export default function Mangas({
	totalMangas,
	ongoingMangas,
	finishedMangas,
	totalChapters,
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
						<h1>{totalMangas}</h1>
						<p>Total mangas</p>
					</div>
					<div className={styles.infoCard}>
						<h1>{ongoingMangas}</h1>
						<p>Ongonig mangas</p>
					</div>
					<div className={styles.infoCard}>
						<h1>{finishedMangas}</h1>
						<p>Finished mangas</p>
					</div>
					<div className={styles.infoCard}>
						<h1>{totalChapters}</h1>
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

	const [details, ongoingMangas, featuredMangas] = await Promise.all([
		Manga.aggregate([
			{
				$group: {
					_id: 1,
					totalMangas: {
						$count: {},
					},
					totalChapters: {
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

	console.log(details);

	const { totalMangas, totalChapters } = details[0];

	const finishedMangas = totalMangas - ongoingMangas;

	const props: PageProps = {
		totalMangas,
		ongoingMangas,
		finishedMangas,
		totalChapters,
		featuredMangas,
	};

	return { props };
};
