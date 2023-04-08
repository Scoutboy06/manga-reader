import Head from 'next/head';
import styles from './mangas.module.css';
import AdminLayout from '@/components/layouts/AdminLayout';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]';
import Manga from '@/models/mangaModel';
import IUser from '@/types/User';

type PageProps = {
	user: IUser;
	totalMangas: number;
	ongoingMangas: number;
	finishedMangas: number;
	totalChapters: number;
};

export default function Mangas({
	user,
	totalMangas,
	ongoingMangas,
	finishedMangas,
	totalChapters,
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
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session?.user?.isAdmin) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const [totalMangas, ongoingMangas, totalChapters] = await Promise.all([
		Manga.countDocuments({}),
		Manga.countDocuments({ airStatus: 'ongoing' }),
		Manga.aggregate([
			{
				$group: {
					_id: null,
					count: {
						$sum: { $size: '$chapters' },
					},
				},
			},
		]),
	]);

	const finishedMangas = totalMangas - ongoingMangas;

	const props: PageProps = {
		user: JSON.parse(JSON.stringify(session.user)),
		totalMangas,
		ongoingMangas,
		finishedMangas,
		totalChapters: totalChapters[0].count,
	};

	return { props };
};
