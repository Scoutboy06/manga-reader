import { useState, useContext } from 'react';
import fetchAPI from '@/functions/fetchAPI';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import MediaCard from '@/components/MediaCard';
import Navbar from '@/components/navbars/Library';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';

import styles from '@/styles/mangas.module.css';

export default function Mangas({ headerMangas, continueReading }) {
	const [slideshowIndex, setSlideshowIndex] = useState(0);

	return (
		<>
			<Head>
				<title>Manga Reader</title>
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
											width={150}
											height={225}
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
											<h1>
												{manga.title}
												<Link
													href={`/mangas/${manga.urlName}`}
													className='icon'
													style={{ marginLeft: 6 }}
												>
													open_in_new
												</Link>
											</h1>
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
								href={`/mangas/${manga.urlName}/${manga.currentChapter.urlName}`}
								imgUrl={manga.poster}
								title={manga.title}
								subtitle={`Chapter ${manga.currentChapter.number}`}
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
		fetchAPI('/users/6240ce1e13856cb6d466e27a/mangas'),
	]);

	return {
		props: {
			headerMangas,
			continueReading,
		},
	};
}
