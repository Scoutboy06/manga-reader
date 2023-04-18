import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import Manga from '@/models/Manga.model';
import connectDB from '@/lib/mongoose';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';
import styles from './Home.module.css';
import MangaCard from '@/components/MangaCard';
import DefaultLayout from '@/layouts/DefaultLayout';
import { GetServerSideProps } from 'next';
import IManga from '@/types/Manga';
import { HydratedDocument } from 'mongoose';
import Slideshow from '@/components/Slideshow';

interface Props {
	featuredMangas: HydratedDocument<IManga>[];
	popularMangas: HydratedDocument<IManga>[];
	recentlyUpdated: HydratedDocument<IManga>[];
}

export default function Home({
	featuredMangas,
	popularMangas,
	recentlyUpdated,
}: Props) {
	const { data: continueReading } = useSWR(`/api/me/mangas?limit=12`);

	return (
		<>
			<Head>
				<title>Manga Reader</title>
			</Head>

			<DefaultLayout>
				<header>
					<Slideshow mangas={featuredMangas} />
				</header>

				<section className={styles.section}>
					<HorizontalScrollContainer
						title={
							<>
								Popular Mangas
								<Link
									href='/mangas/popular'
									className='btn btn-secondary btn-sm'
									style={{ display: 'inline', marginLeft: '1rem' }}
								>
									See all
								</Link>
							</>
						}
						gap='1rem'
					>
						{popularMangas.map((manga, i) => (
							<MangaCard.Vertical
								key={manga._id.toString()}
								href={`/mangas/${manga.urlName}`}
								image={manga.poster}
								title={manga.title}
								imagePriority={i <= 3}
							/>
						))}
					</HorizontalScrollContainer>
				</section>

				{continueReading?.length > 0 && (
					<section className={styles.section}>
						<HorizontalScrollContainer title='Continue Reading' gap='1rem'>
							{continueReading?.map(manga => (
								<MangaCard.Vertical
									key={manga._id}
									href={`/mangas/${manga.urlName}/${manga.currentChapter.urlName}`}
									title={manga.title}
									titleHref={`/mangas/${manga.urlName}`}
									image={manga.poster}
									subtitle={`Chapter ${manga.currentChapter.number}`}
								/>
							))}
						</HorizontalScrollContainer>
					</section>
				)}

				<section className={styles.section}>
					<h1 className={styles.title}>
						Recently Updated
						<Link
							href='/mangas/updated'
							className='btn btn-secondary btn-sm'
							style={{ display: 'inline', marginLeft: '1rem' }}
						>
							See all
						</Link>
					</h1>

					<div className={styles.horizontalCards}>
						{recentlyUpdated?.map(manga => (
							<MangaCard.Horizontal
								title={manga.title}
								urlName={manga.urlName}
								image={manga.poster}
								chapters={manga.chapters}
							/>
						))}
					</div>
				</section>
			</DefaultLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async context => {
	await connectDB();

	const [featuredMangas, popularMangas, recentlyUpdated] = await Promise.all([
		await Manga.find(
			{ featuredIndex: { $exists: true } },
			{ chapters: 0 },
			{ sort: { featuredIndex: 1 } }
		),

		await Manga.find(
			{ popularIndex: { $exists: true } },
			{ title: 1, urlName: 1, poster: 1 },
			{ sort: { popularIndex: 1 } }
		),
		await Manga.find(
			{},
			{ chapters: { $slice: [0, 3] }, title: 1, urlName: 1, poster: 1 },
			{ limit: 12, sort: { latestChapterAt: -1 } }
		),
	]);

	const props: Props = {
		featuredMangas: JSON.parse(JSON.stringify(featuredMangas)),
		popularMangas: JSON.parse(JSON.stringify(popularMangas)),
		recentlyUpdated: JSON.parse(JSON.stringify(recentlyUpdated)),
	};

	return { props };
};
