import { useState, useContext } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import fetchAPI from '@/functions/fetchAPI';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import MediaCard from '@/components/MediaCard';
import Navbar from '@/components/navbars/Library';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';

// import { ProfileContext } from '@/contexts/ProfileContext';
// import { PopupContext } from '@/contexts/PopupContext';

import styles from '@/styles/mangas.module.css';

export default function Mangas({ headerMangas, continueReading }) {
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
							onClick={() =>
								setSlideshowIndex(
									slideshowIndex - 1 < 0
										? headerMangas.length - 1
										: slideshowIndex - 1
								)
							}
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
									aria-label='Slideshow index'
								></button>
							))}
						</div>

						<div
							className={styles.items}
							style={{ transform: `translateX(-${slideshowIndex * 100}%)` }}
						>
							{headerMangas.map((manga, i) => (
								<div className={styles.item} key={manga._id}>
									<Image
										src={manga.backdrop}
										alt='Backdrop'
										width={1280}
										height={720}
										className={styles.backdrop}
										priority={i === 0}
									/>

									<div className={styles.metadata}>
										<Image
											width={300}
											height={450}
											src={manga.poster}
											alt={manga.title}
											className={styles.poster}
											priority={i === 0}
										/>

										<div className={styles.text}>
											<p className={styles.genres}>
												{manga.genres.split(', ').map(genre => (
													<Link
														href={`/mangas/genres/${genre.toLowerCase()}`}
														key={genre}
													>
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

				<section className={styles.continueReading}>
					<HorizontalScrollContainer title='Continue Reading'>
						{continueReading?.map(manga => (
							<MediaCard
								key={manga._id}
								href={`/mangas/${manga.urlName}`}
								imgUrl={manga.poster}
								title={manga.title}
								// subtitle={manga.currentChapter}
								orientation='vertical'
							/>
						))}
					</HorizontalScrollContainer>
				</section>
			</main>
		</>
	);
}

export async function getServerSideProps() {
	const [headerMangas, continueReading] = await Promise.all([
		fetchAPI('/mangas?limit=10'),
		fetchAPI('/mangas?limit=10'),
	]);

	return {
		props: {
			headerMangas,
			continueReading,
		},
	};
}
