import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Manga from '@/models/mangaModel';

import Navbar from '@/components/navbars/Library';

import styles from './manga.module.css';

export default function MangaPage({ manga }) {
	const [expandDescription, setExpandDescription] = useState(false);

	return (
		<>
			<Head>
				<title>{manga.title} - Manga Reader</title>
				<meta name='description' content={manga.description} />
			</Head>

			<Navbar />

			<header className={styles.header}>
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
							href={`/mangas/${manga.urlName}/chapter-1`}
							className='btn btn-lg btn-primary icon-right'
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
								<th>
									{manga.genres.split(', ').map(genre => (
										<Link
											href={`/mangas/genres/${genre}`}
											key={`genre_${genre}`}
											className={styles.genre}
										>
											{genre},
										</Link>
									))}
								</th>
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
			</header>

			<main className={styles.main}>
				<h2>Chapters</h2>

				<div className={styles.chapters}>
					{manga.chapters.map(chapter => (
						<Link
							key={`chapter_${chapter.number}`}
							href={`/mangas/${manga.urlName}/${chapter.urlName}`}
						>
							{chapter.title}
						</Link>
					))}
				</div>
			</main>
		</>
	);
}

export async function getServerSideProps({ params: { urlName } }) {
	await connectDB();
	const manga = await Manga.findOne({ urlName });

	return {
		props: {
			manga: JSON.parse(JSON.stringify(manga)),
		},
	};
}
