import { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';

import fetchAPI from '@/functions/fetchAPI';

import Select from '@/components/Select';
import Loader from '@/components/Loader';

import { ProfileContext } from '@/contexts/ProfileContext';
// import { SettingsContext } from '@/contexts/SettingsContext';

import styles from '@/styles/ReadWrapper.module.css';


export default function ReadManga() {
	const router = useRouter();
	const { query } = router;

	const [{ currentProfile }] = useContext(ProfileContext);
	// const [{ imageWidth }, { setImageWidth }] = useContext(SettingsContext);
	const [imageWidth, setImageWidth] = useState(1);

	const { data: mangaMeta } = useSWRImmutable(
		() => `/users/${currentProfile._id}/mangas/${query.manga}`
	);

	const { data: chapterMeta } = useSWRImmutable(() =>
		query.chapter ? `/mangas/${mangaMeta._id}/${query.chapter}` : null
	);

	const { prevChap, currChap, nextChap } = useChapterPagination({ currentProfile, mangaMeta });

	const {
		scrollProgress,
		imagesContainerRef,
		imageLoadHandler,
	} = useScrollProgress({ chapterMeta, imageWidth });

	const isLoading = !chapterMeta || !mangaMeta;

	return (
		<>
			<div className={styles.header}>
				<div style={{ marginBottom: 10 }}>
					<Select
						onChange={chapterUrlName =>
							router.push(`/mangas/${query.manga}/${chapterUrlName}`)
						}
						value={query.chapter}
						containerText={
							<h1 className={styles.title}>{currChap?.title}</h1>
						}
						placement='bl'
						options={mangaMeta?.chapters?.map(chapter => ({
							value: chapter.urlName,
							label: chapter.title,
						}))}
					/>
				</div>

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

					<Select
						defaultValue={imageWidth}
						onChange={value => {
							setImageWidth(value === 'pageWidth' ? 'pageWidth' : value);
						}}
						containerText={
							imageWidth === 'pageWidth'
								? 'Page width'
								: `${imageWidth * 100}%`
						}
						placement='br'
						options={[
							{ value: 'pageWidth', label: 'Page width' },
							'divider',
							{ value: 0.5, label: '50%' },
							{ value: 0.75, label: '75%' },
							{ value: 0.9, label: '90%' },
							{ value: 1.0, label: '100%' },
							{ value: 1.25, label: '125%' },
							{ value: 1.5, label: '150%' },
							{ value: 2.0, label: '200%' },
						]}
					/>
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
			</div>

			<section
				className={styles.chapters}
				style={{
					width:
						imageWidth === 'pageWidth'
							? '100%'
							: `calc(50% * ${imageWidth})`,
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
								{/* eslint-disable-next-line jsx-a11y/alt-text */}
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

			<div className={styles.header}>
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
			</div>

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
	}

	const setImagesTopCoords = (start = 0, end = chapterMeta?.images?.length) => {
		if (!chapterMeta?.images) return;

		for (let i = start; i < end; i++) {
			const el = imagesContainerRef.current.children[i];
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
	}
}


function useChapterPagination({ currentProfile, mangaMeta }) {
	const router = useRouter();
	const { chapter } = router.query;

	const [data, setData] = useState({
		prevChap: null,
		currChap: null,
		nextChap: null,
	});

	// Load chapters
	useEffect(() => {
		if (!mangaMeta) return;

		const { chapters } = mangaMeta;
		const currChapIndex = chapters.findIndex(
			chap => chap.urlName === chapter
		);

		setData({
			prevChap: chapters[currChapIndex - 1],
			currChap: chapters[currChapIndex],
			nextChap: chapters[currChapIndex + 1],
		});

		// Sync chapter with server
		fetchAPI(
			`/users/${currentProfile._id}/mangas/${mangaMeta._id}/currentChapter`,
			{
				method: 'POST',
				body: JSON.stringify({ urlName: chapter }),
			}
		);
	}, [mangaMeta, router.query]);


	return data;
}
