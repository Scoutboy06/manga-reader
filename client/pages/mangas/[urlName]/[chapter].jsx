import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import { useSession } from 'next-auth/react';
import Select from '@/components/Select';
import Loader from '@/components/Loader';
import styles from '@/styles/read.module.css';
import Manga from '@/models/Manga.model';
import Head from 'next/head';
import axios from 'axios';

export default function ReadManga() {
	const router = useRouter();
	const { query } = router;
	const [imageWidth, setImageWidth] = useState(null);

	const { data: mangaMeta } = useSWRImmutable(() =>
		query.urlName ? `/api/mangas/${query.urlName}` : null
	);
	const { data: chapterMeta } = useSWRImmutable(() =>
		query.chapter
			? `/api/scraper/mangas/${query.urlName}/${query.chapter}`
			: null
	);
	const isLoading = !chapterMeta || !mangaMeta;

	const { prevChap, currChap, nextChap } = useChapterPagination(mangaMeta);

	const { scrollProgress, imagesContainerRef, imageLoadHandler } =
		useScrollProgress({ chapterMeta, imageWidth });

	useEffect(() => {
		if (!imageWidth) {
			setImageWidth(Number(localStorage.getItem('imageWidth')) || 1);
		} else {
			localStorage.setItem('imageWidth', imageWidth);
		}
	}, [imageWidth]);

	return (
		<>
			<Head>
				<title>
					{mangaMeta?.title} - Chapter {chapterMeta?.number}
				</title>
			</Head>

			<header className={styles.header}>
				<Select.Root style={{ marginBottom: 10 }}>
					<Select.Button className={styles.title}>
						{'Chapter ' + (currChap?.number || '')}
					</Select.Button>

					<Select.Options
						value={query.chapter}
						options={mangaMeta?.chapters?.map(chapter => ({
							value: chapter.urlName,
							label: `Chapter ${chapter.number}`,
						}))}
						onChange={urlName =>
							router.push(`/mangas/${query.urlName}/${urlName}`)
						}
					/>
				</Select.Root>

				<div className={styles.container} style={{ marginBottom: 30 }}>
					<a
						href={chapterMeta?.originalUrl}
						target='_blank'
						rel='nofollow noreferrer noopener'
						className={styles.button}
						disabled={isLoading || !chapterMeta?.originalUrl}
					>
						<i className='icon'>open_in_new</i>
					</a>

					<Select.Root>
						<Select.Button>
							{imageWidth === 'pageWidth'
								? 'Page width'
								: `${imageWidth * 100}%`}
						</Select.Button>

						<Select.Options
							value={imageWidth}
							options={[
								{ value: 'pageWidth', label: 'Page width' },
								<hr />,
								{ value: 0.5, label: '50%' },
								{ value: 0.75, label: '75%' },
								{ value: 0.9, label: '90%' },
								{ value: 1, label: '100%' },
								{ value: 1.25, label: '125%' },
								{ value: 1.5, label: '150%' },
								{ value: 1.75, label: '175%' },
								{ value: 2, label: '200%' },
							]}
							onChange={value => setImageWidth(value)}
							placement='br'
						/>
					</Select.Root>
				</div>

				<div className={styles.container}>
					<button
						onClick={() => {
							window.scrollTo(0, 0);
							router.push(`/mangas/${mangaMeta.urlName}/${prevChap.urlName}`);
						}}
						className={styles.button + ' icon-left'}
						disabled={isLoading || !prevChap}
					>
						<i className='icon'>arrow_back</i>
						Prev
					</button>

					<Link href='/mangas' className={styles.button}>
						<i className='icon'>home</i>
					</Link>

					<button
						onClick={() => {
							window.scrollTo(0, 0);
							router.push(`/mangas/${mangaMeta.urlName}/${nextChap.urlName}`);
						}}
						className={styles.button + ' icon-right'}
						disabled={isLoading || !nextChap}
					>
						Next
						<i className='icon'>arrow_forward</i>
					</button>
				</div>
			</header>

			<section
				className={styles.chapters}
				style={{
					width:
						imageWidth === 'pageWidth' ? '100%' : `calc(50% * ${imageWidth})`,
				}}
				ref={imagesContainerRef}
			>
				{isLoading ? (
					<div style={{ height: 100, marginTop: 30, marginBottom: 30 }}>
						<Loader size={100} style={{ left: 'calc(50% - 50px)' }} />
					</div>
				) : (
					<>
						{chapterMeta?.images?.map((image, index) => (
							<div
								className={styles.imageContainer}
								key={index}
								data-isloaded={false}
							>
								<img
									src={image}
									loading='lazy'
									onLoad={e => imageLoadHandler(e, index)}
								/>
							</div>
						))}
					</>
				)}
			</section>

			<header className={styles.header}>
				<div className={styles.container}>
					<button
						onClick={() => {
							window.scrollTo(0, 0);
							router.push(`/mangas/${mangaMeta.urlName}/${prevChap.urlName}`);
						}}
						className={styles.button + ' icon-left'}
						disabled={isLoading || !prevChap}
					>
						<i className='icon'>arrow_back</i>
						Prev
					</button>

					<Link href='/mangas' className={styles.button}>
						<i className='icon'>home</i>
					</Link>

					<button
						onClick={() => {
							window.scrollTo(0, 0);
							router.push(`/mangas/${mangaMeta.urlName}/${nextChap.urlName}`);
						}}
						className={styles.button + ' icon-right'}
						disabled={isLoading || !nextChap}
					>
						Next
						<i className='icon'>arrow_forward</i>
					</button>
				</div>
			</header>

			<div className={styles.progressContainer}>
				<span>Ch. {chapterMeta?.number}</span>
				<span>
					{scrollProgress || '-'} / {chapterMeta?.images?.length || '-'}
				</span>
			</div>
		</>
	);
}

function useScrollProgress({ chapterMeta, imageWidth }) {
	const [scrollProgress, setScrollProgress] = useState('-');
	const imageSizes = useRef([]);
	const imagesContainerRef = useRef();

	const scrollHandler = () => {
		if (!chapterMeta?.images) return;
		let currentImageIndex = 0;

		for (let i = 0; i < chapterMeta.images.length; i++) {
			const imgY = imageSizes.current[i];

			if (window.scrollY + window.innerHeight * 0.5 > imgY) {
				currentImageIndex = i;
			}
		}

		setScrollProgress(currentImageIndex + 1);
	};

	const setImagesTopCoords = (start = 0, end = chapterMeta?.images?.length) => {
		if (!chapterMeta?.images) return;

		for (let i = start; i < end; i++) {
			const el = imagesContainerRef.current.children[i];
			if (!el) return;
			const { y } = el.getBoundingClientRect();
			imageSizes.current[i] = y + window.scrollY;
		}

		if (scrollProgress === '-') scrollHandler();
	};

	const imageLoadHandler = (e, index) => {
		e.target.parentElement.setAttribute('data-isloaded', true);

		setImagesTopCoords(index);
	};

	useEffect(() => {
		if (chapterMeta?.images) {
			document.addEventListener('scroll', scrollHandler);
			window.addEventListener('resize', setImagesTopCoords);
			setImagesTopCoords();
		}

		return () => {
			document.removeEventListener('scroll', scrollHandler);
			window.removeEventListener('resize', setImagesTopCoords);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chapterMeta]);

	useEffect(() => {
		const ANIMATION_DURATION = 300;

		setTimeout(() => {
			setImagesTopCoords();
			scrollHandler();
		}, ANIMATION_DURATION + 50);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageWidth]);

	return {
		scrollProgress,
		imagesContainerRef,
		imageLoadHandler,
	};
}

function useChapterPagination(mangaMeta) {
	const { data: session } = useSession();
	const router = useRouter();
	const { urlName, chapter } = router.query;

	const [data, setData] = useState({
		prevChap: null,
		currChap: null,
		nextChap: null,
	});

	// Load chapters
	useEffect(() => {
		if (!mangaMeta) return;

		const { chapters } = mangaMeta;
		const currChapIndex = chapters.findIndex(chap => chap.urlName === chapter);

		// Chapters are in reverse chronological order
		const prevChap = chapters[currChapIndex + 1];
		const currChap = chapters[currChapIndex];
		const nextChap = chapters[currChapIndex - 1];

		setData({ prevChap, currChap, nextChap });

		// Sync chapter with server
		if (session?.user) {
			axios
				.post(`/api/me/mangas/${mangaMeta.urlName}/currentChapter`, {
					urlName: chapter,
				})
				.then(console.log)
				.catch(console.error);
		}
	}, [mangaMeta, router.query]);

	return data;
}

// export const getServerSideProps = async ({ params }) => {
// 	const { urlName } = params;
// 	const manga = await Manga.findOne({ urlName });

// 	if (!manga) return { notFound: true };

// 	return {
// 		props: {
// 			manga: JSON.parse(JSON.stringify(manga)),
// 		},
// 	};
// };
