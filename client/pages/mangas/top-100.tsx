import styles from './listPage.module.css';
import Manga from '@/models/Manga.model';
import IManga from '@/types/Manga';
import { GetServerSideProps } from 'next';
import MangaCard from '@/components/MangaCard';
import DefaultLayout from '@/layouts/DefaultLayout';
import Pagination from '@/components/Pagination';
import { useRouter } from 'next/router';
import Head from 'next/head';
import connectDB from '@/lib/mongoose';

interface Props {
	mangas: IManga[];
	currentPage: number;
	lastPage: number;
}

export default function Top100Page({ mangas, currentPage, lastPage }: Props) {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Top 100 Mangas</title>
			</Head>

			<DefaultLayout>
				<main className={styles.main}>
					<h1>Top 100 Mangas</h1>

					<div className={styles.mangas + ' vertical'}>
						{mangas.map(manga => (
							<MangaCard.Vertical
								key={manga._id.toString()}
								title={manga.title}
								titleHref={`/mangas/${manga.urlName}`}
								href={`/mangas/${manga.urlName}`}
								image={manga.poster}
							/>
						))}
					</div>

					<div className={styles.pagination}>
						<Pagination
							currentPage={currentPage}
							lastPage={lastPage}
							paginate={pageNumber =>
								router.push(`/mangas/top-100?page=${pageNumber}`)
							}
						/>
					</div>
				</main>
			</DefaultLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async context => {
	await connectDB();
	const itemsPerPage = 24;
	const page = Number(context.query.page) || 1;

	const filter = { top100Index: { $exists: true } };

	const mangas = await Manga.find(
		filter,
		{
			chapters: { $slice: [0, 3] },
			title: 1,
			urlName: 1,
			poster: 1,
		},
		{
			limit: itemsPerPage,
			skip: (Number(page) - 1) * itemsPerPage,
			sort: { top100Index: 1 },
		}
	);

	const lastPage = Math.ceil(
		(await Manga.countDocuments({ filter })) / itemsPerPage
	);

	return {
		props: {
			mangas: JSON.parse(JSON.stringify(mangas)),
			currentPage: page,
			lastPage,
		},
	};
};
