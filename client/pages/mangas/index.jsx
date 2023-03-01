import { useState, useContext } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import fetchAPI from '@/functions/fetchAPI';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// import MediaCard from '@/components/MediaCard';
import Navbar from '@/components/navbars/Library';

// import { ProfileContext } from '@/contexts/ProfileContext';
// import { PopupContext } from '@/contexts/PopupContext';

import styles from '@/styles/mangas.module.css';

export default function Mangas({ headerMangas }) {
	// const router = useRouter();

	// const [{ currentProfile }] = useContext(ProfileContext);

	const [slideshowIndex, setSlideshowIndex] = useState(0);

	return (
		<>
			<Head>
				<title>Manga Reader - Read Manga Online For Free</title>
			</Head>

			<Navbar />

			<main className={styles.main}>
				<header>
					<div className={styles.slideshow}>
						<div
							className={styles.prevBtn + ' icon'}
							onClick={() => setSlideshowIndex((slideshowIndex - 1) % 10)}
						>
							arrow_back_ios_new
						</div>
						<div
							className={styles.nextBtn + ' icon'}
							onClick={() => setSlideshowIndex((slideshowIndex + 1) % 10)}
						>
							arrow_forward_ios
						</div>

						<div className={styles.smallButtons}>
							{headerMangas.map((_, i) => (
								<button
									onClick={() => setSlideshowIndex(i)}
									className={slideshowIndex === i ? 'active' : ''}
									key={`button_${i}`}
								></button>
							))}
						</div>

						<div
							className={styles.items}
							style={{ transform: `translateX(-${slideshowIndex * 100}%)` }}
						>
							{headerMangas.map(manga => (
								<div className={styles.item} key={manga._id}>
									<img
										src={
											manga.backdrop ||
											'https://www.themoviedb.org/t/p/original/iiGtoYxmKFq85i0C196veQJtyVB.jpg'
										}
										alt='Backdrop'
										className={styles.backdrop}
									/>

									<div className={styles.metadata}>
										<img
											src={manga.poster}
											alt={manga.title}
											className={styles.poster}
										/>

										<div className={styles.text}>
											<p className={styles.genres}>
												{manga.genres.split(', ').map(genre => (
													<Link href={`/mangas/genres/${genre.toLowerCase()}`}>
														{genre}
													</Link>
												))}
											</p>
											<h1>{manga.title}</h1>
											<p className={styles.description}>{manga.description}</p>
										</div>

										<Link
											href={`/mangas/${manga.urlName}`}
											className={styles.readManga}
										>
											<i className='icon'>book</i>
											<span>Read Manga</span>
										</Link>
									</div>
								</div>
							))}
						</div>
					</div>
				</header>
			</main>
		</>
	);
}

export async function getServerSideProps() {
	const headerMangas = await fetchAPI('/mangas?limit=10');

	return {
		props: {
			headerMangas,
		},
	};
}