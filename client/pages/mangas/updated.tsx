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

export default function UpdatedMangas({
	mangas,
	currentPage,
	lastPage,
}: Props) {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Latest Updates</title>
			</Head>

			<DefaultLayout>
				<main className={styles.main}>
					<h1>Latest Updates</h1>

					<div className={styles.mangas}>
						{mangas.map(manga => (
							<MangaCard.Horizontal
								key={manga._id.toString()}
								title={manga.title}
								urlName={manga.urlName}
								image={manga.poster}
								chapters={manga.chapters}
							/>
						))}
					</div>

					<div className={styles.pagination}>
						<Pagination
							currentPage={currentPage}
							lastPage={lastPage}
							paginate={pageNumber =>
								router.push(`/mangas/updated?page=${pageNumber}`)
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

	const mangas = await Manga.find(
		{},
		{
			chapters: { $slice: [0, 3] },
			title: 1,
			urlName: 1,
			poster: 1,
			latestChapterAt: 1,
		},
		{
			limit: itemsPerPage,
			skip: (Number(page) - 1) * itemsPerPage,
			sort: { latestChapterAt: -1 },
		}
	);

	const lastPage = Math.ceil((await Manga.countDocuments({})) / itemsPerPage);

	return {
		props: {
			mangas: JSON.parse(JSON.stringify(mangas)),
			currentPage: page,
			lastPage,
		},
	};
};
