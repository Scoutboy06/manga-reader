import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import fetchAPI from '../../functions/fetchAPI';

import Loader from '../../components/Loader';
import Head from '../../components/Head';

import { ProfileContext } from '../../contexts/ProfileContext';

import styles from './read.module.css';

export default function Read() {
	const params = useParams();
	const navigate = useNavigate();
	const [profileData] = useContext(ProfileContext);

	const [chapters, setChapters] = useState({
		prev: null,
		curr: params.chapter,
		next: null,
		title: null,
	});
	const [images, setImages] = useState();
	const [originalUrl, setOriginalUrl] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [mangaMeta, setMangaMeta] = useState();

	const [isFullWidth, setIsFullWidth] = useState(false);

	const fetchChapters = () =>
		fetchAPI(`/api/mangas/${params.mangaName}/${params.chapter}`);

	const updateProgress = (isLast, mangaId) =>
		fetchAPI(
			`/api/mangas/${mangaId}/updateProgress?userId=${profileData.currentProfile._id}`,
			{
				method: 'PUT',
				body: JSON.stringify({
					// urlName: params.mangaName,
					chapter: params.chapter,
					isLast,
				}),
			}
		);

	const getMangaInfo = () =>
		fetchAPI(
			`/api/mangas/${params.mangaName}?userId=${profileData.currentProfile._id}`
		);

	const storeFullWidthData = isFullWidth => {
		const json = JSON.parse(localStorage.getItem('isFullWidth'));
		json[params.mangaName] = isFullWidth;
		localStorage.setItem('isFullWidth', JSON.stringify(json));
	};

	useEffect(() => {
		(async function () {
			setIsLoading(true);

			if (profileData.isLoading) return;

			let meta;
			if (!mangaMeta) {
				meta = await getMangaInfo();
				setMangaMeta(meta);
			} else {
				meta = mangaMeta;
			}

			if (!params.chapter) {
				navigate(`/read/${params.mangaName}/${meta.chapter}`, {
					replace: true,
				});
				return;
			}

			const chaps = await fetchChapters();
			setChapters({
				prev: chaps.prevPath,
				curr: params.chapter,
				next: chaps.nextPath,
				title: chaps.chapterTitle,
			});
			setImages(chaps.images);
			setOriginalUrl(chaps.originalUrl);

			setIsLoading(false);

			updateProgress(!chaps.nextPath, meta._id);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params, profileData.isLoading]);

	useEffect(() => {
		// localStorage init
		const json = JSON.parse(localStorage.getItem('isFullWidth'));
		if (!json) {
			const data = {};
			data[params.mangaName] = false;
			localStorage.setItem('isFullWidth', JSON.stringify(data));
			return;
		}

		const width = json[params.mangaName];
		if (width) setIsFullWidth(width);
		else setIsFullWidth(false);
	}, [params.mangaName]);

	if (!profileData.isLoading && !profileData.currentProfile) {
		navigate('/');
		return null;
	}

	return (
		<main className={styles.main} data-isfullwidth={isFullWidth}>
			<Head>
				<title>{params.chapter + ' - ' + params.mangaName}</title>
			</Head>

			<Header
				isTop={true}
				chapters={chapters}
				originalUrl={originalUrl}
				isFullWidth={isFullWidth}
				setIsFullWidth={setIsFullWidth}
				storeFullWidthData={storeFullWidthData}
			/>

			{isLoading && (
				<div style={{ height: 100, marginTop: 30, marginBottom: 30 }}>
					<Loader size={100} style={{ left: 'calc(50% - 50px)' }} />
				</div>
			)}

			{!isLoading && (
				<section className={styles.chapters}>
					{images &&
						images.map((image, index) => (
							<img src={image} key={index} alt='Failed to load' />
						))}
				</section>
			)}

			<Header
				chapters={chapters}
				isFullWidth={isFullWidth}
				setIsFullWidth={setIsFullWidth}
				storeFullWidthData={storeFullWidthData}
			/>
		</main>
	);
}

function Header({
	chapters: { prev, curr, next, title },
	isLoading,
	originalUrl,
	isTop,
	isFullWidth,
	setIsFullWidth,
	storeFullWidthData,
}) {
	const params = useParams();

	return (
		<header className={styles.header}>
			{isTop && <h2 className={styles.title}>{title}</h2>}

			{isTop && (
				<div className={styles.container} style={{ marginBottom: 30 }}>
					<a
						href={originalUrl}
						target='_blank'
						rel='nofollow noreferrer noopener'
						className='button'
						disabled={isLoading || !originalUrl}
					>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M0 0h24v24H0V0z' fill='none' />
							<path d='M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z' />
						</svg>
					</a>

					<button
						className='button'
						onClick={() => {
							storeFullWidthData(!isFullWidth);
							setIsFullWidth(!isFullWidth);
						}}
					>
						{isFullWidth ? (
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
								<rect fill='none' height='24' width='24' />
								<path d='M21.29,4.12l-4.59,4.59l1.59,1.59c0.63,0.63,0.18,1.71-0.71,1.71H13c-0.55,0-1-0.45-1-1V6.41c0-0.89,1.08-1.34,1.71-0.71 l1.59,1.59l4.59-4.59c0.39-0.39,1.02-0.39,1.41,0v0C21.68,3.1,21.68,3.73,21.29,4.12z M4.12,21.29l4.59-4.59l1.59,1.59 c0.63,0.63,1.71,0.18,1.71-0.71V13c0-0.55-0.45-1-1-1H6.41c-0.89,0-1.34,1.08-0.71,1.71l1.59,1.59l-4.59,4.59 c-0.39,0.39-0.39,1.02,0,1.41l0,0C3.1,21.68,3.73,21.68,4.12,21.29z' />
							</svg>
						) : (
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
								<rect fill='none' height='24' width='24' />
								<path d='M21,8.59V4c0-0.55-0.45-1-1-1h-4.59c-0.89,0-1.34,1.08-0.71,1.71l1.59,1.59l-10,10l-1.59-1.59C4.08,14.08,3,14.52,3,15.41 V20c0,0.55,0.45,1,1,1h4.59c0.89,0,1.34-1.08,0.71-1.71l-1.59-1.59l10-10l1.59,1.59C19.92,9.92,21,9.48,21,8.59z' />
							</svg>
						)}
					</button>
				</div>
			)}

			<div className={styles.container}>
				<Link
					to={`/read/${params.mangaName}/${prev}`}
					className='button icon-left'
					disabled={isLoading || !prev}
				>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
						<path d='M0 0h24v24H0V0z' fill='none' />
						<path d='M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z' />
					</svg>
					<span>Prev</span>
				</Link>

				<Link to='/' className='button'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
						<path d='M0 0h24v24H0V0z' fill='none' />
						<path d='M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z' />
					</svg>
				</Link>

				<Link
					to={`/read/${params.mangaName}/${next}`}
					className='button icon-right'
					disabled={isLoading || !next}
				>
					<span>Next</span>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
						<path d='M0 0h24v24H0V0z' fill='none' />
						<path d='M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z' />
					</svg>
				</Link>
			</div>
		</header>
	);
}
