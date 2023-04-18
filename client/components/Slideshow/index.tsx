import styles from './Slideshow.module.css';
import IManga from '@/types/Manga';
import { HydratedDocument } from 'mongoose';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
	mangas: HydratedDocument<IManga>[];
}

export default function Slideshow({ mangas }: Props) {
	const [slideshowIndex, setSlideshowIndex] = useState(0);

	return (
		<div className={styles.slideshow}>
			<button
				className={styles.prevBtn + ' icon'}
				onClick={() =>
					setSlideshowIndex(
						slideshowIndex - 1 < 0 ? mangas.length - 1 : slideshowIndex - 1
					)
				}
			>
				arrow_back_ios_new
			</button>
			<button
				className={styles.nextBtn + ' icon'}
				onClick={() => setSlideshowIndex((slideshowIndex + 1) % mangas.length)}
			>
				arrow_forward_ios
			</button>

			<div className={styles.smallButtons}>
				{mangas?.map((_, i) => (
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
				{mangas.map((manga, i) => (
					<div className={styles.item} key={manga._id.toString()}>
						<Image
							src={manga.backdrop || ''}
							sizes='(max-width: 900px) 100vw
														900px'
							width={1280}
							height={720}
							alt='Backdrop'
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
									{manga.genres?.split(', ')?.map(genre => (
										<span key={genre}>{genre}</span>
									))}
								</p>
								<Link
									href={`/mangas/${manga.urlName}`}
									style={{ marginLeft: 6 }}
								>
									<h1>
										{manga.title}
										<i className='icon'>open_in_new</i>
									</h1>
								</Link>
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
	);
}
