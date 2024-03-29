import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/mongoose';
import Manga from '@/models/Manga.model';
import styles from './manga.module.css';
import DefaultLayout from '@/layouts/DefaultLayout';
import useSWR from 'swr';
import MangaCard from '@/components/MangaCard';

export default function MangaPage({ manga }) {
	const [expandDescription, setExpandDescription] = useState(false);

	const { data: popularMangas } = useSWR('/api/mangas/popular');

	return (
		<>
			<Head>
				<title>{manga.title} - Manga Reader</title>
				<meta name='description' content={manga.description} />
			</Head>

			<DefaultLayout>
				<main className={styles.header}>
					<div className={styles.image}>
						<Image
							src={manga.poster}
							alt={manga.title}
							width={500}
							height={750}
							priority={true}
						/>
					</div>

					<div className={styles.metadata}>
						<div className={styles.title}>
							<h1>{manga.title}</h1>

							<Link
								href={`/mangas/${manga.urlName}/${
									manga.chapters.at(-1).urlName
								}`}
								className='btn btn-primary icon-right'
							>
								Read now
								<i className='icon'>keyboard_arrow_right</i>
							</Link>
						</div>

						<p
							className={
								styles.description + (expandDescription ? ' expand' : '')
							}
						>
							{manga.description}
						</p>
						<button
							type='button'
							className={styles.toggleDescription}
							onClick={() => setExpandDescription(bool => !bool)}
						>
							{expandDescription ? 'Show less' : 'Show more'}
						</button>

						<table className={styles.misc}>
							<tbody>
								<tr>
									<th>Air status</th>
									<th style={{ textTransform: 'capitalize' }}>
										{manga.airStatus}
									</th>
								</tr>
								<tr>
									<th>Genres</th>
									<th>{manga.genres}</th>
								</tr>
								<tr>
									<th>Other names</th>
									<th>{manga.otherNames}</th>
								</tr>
								<tr>
									<th>Authors</th>
									<th>{manga.authors}</th>
								</tr>
								<tr>
									<th>Artists</th>
									<th>{manga.artists}</th>
								</tr>
								<tr>
									<th>Released</th>
									<th>{manga.released}</th>
								</tr>
							</tbody>
						</table>
					</div>
				</main>

				<div className={styles.bottomContainer}>
					<div className={styles.chaptersContainer}>
						<h2>Chapters</h2>
						<div className={styles.chapters}>
							{manga.chapters?.map((chapter, i) => (
								<Link
									key={`chapter_${chapter.number}_${i}`}
									href={`/mangas/${manga.urlName}/${chapter.urlName}`}
								>
									Chapter {chapter.number}
								</Link>
							))}
						</div>
					</div>

					<div className={styles.popularContainer}>
						<h2>Popular Mangas</h2>

						<div className={styles.popularMangas}>
							{popularMangas?.map(manga => (
								<MangaCard.Horizontal
									title={manga.title}
									urlName={manga.urlName}
									image={manga.poster}
									chapters={manga.chapters}
								/>
							))}
						</div>
					</div>
				</div>
			</DefaultLayout>
		</>
	);
}

export async function getServerSideProps({ params: { urlName } }) {
	await connectDB();
	const manga = await Manga.findOne({ urlName });

	if (!manga) {
		return { notFound: true };
	}

	return {
		props: {
			manga: JSON.parse(JSON.stringify(manga)),
		},
	};
}
