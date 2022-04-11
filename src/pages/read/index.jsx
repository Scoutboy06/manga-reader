import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import fetchAPI from '../../functions/fetchAPI';

import Loader from '../../components/Loader';
import Title from '../../components/Title';

import { ProfileContext } from '../../contexts/ProfileContext';

import styles from './read.module.css';

export default function Read({ match, location }) {
	const history = useHistory();
	const [profileData] = useContext(ProfileContext);

	const [chapters, setChapters] = useState({
		prev: null,
		curr: match.params.chapter,
		next: null,
	});
	const [images, setImages] = useState();
	const [originalUrl, setOriginalUrl] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [mangaMeta, setMangaMeta] = useState();

	const [isFullWidth, setIsFullWidth] = useState(false);

	const fetchChapters = () =>
		fetchAPI(`/api/mangas/${match.params.mangaName}/${match.params.chapter}`);

	const updateProgress = (isLast, mangaId) =>
		fetchAPI(
			`/api/mangas/${mangaId}/updateProgress?userId=${profileData.currentProfile._id}`,
			{
				method: 'PUT',
				body: JSON.stringify({
					// urlName: match.params.mangaName,
					chapter: match.params.chapter,
					isLast,
				}),
			}
		);

	const getMangaInfo = () =>
		fetchAPI(
			`/api/mangas/${match.params.mangaName}?userId=${profileData.currentProfile._id}`
		);

	const storeFullWidthData = isFullWidth => {
		const json = JSON.parse(localStorage.getItem('isFullWidth'));
		json[match.params.mangaName] = isFullWidth;
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

			if (!match.params.chapter) {
				history.push(`/read/${match.params.mangaName}/${meta.chapter}`);
				return;
			}

			const chaps = await fetchChapters();
			console.log(chaps);
			setChapters({
				prev: chaps.prevPath,
				curr: match.params.chapter,
				next: chaps.nextPath,
			});
			setImages(chaps.images);
			setOriginalUrl(chaps.originalUrl);

			setIsLoading(false);

			updateProgress(!chaps.nextPath, meta._id);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match.params, profileData.isLoading]);

	useEffect(() => {
		// localStorage init
		const json = JSON.parse(localStorage.getItem('isFullWidth'));
		if (!json) {
			const data = {};
			data[match.params.mangaName] = false;
			localStorage.setItem('isFullWidth', JSON.stringify(data));
			return;
		}

		const width = json[match.params.mangaName];
		if (width) setIsFullWidth(width);
		else setIsFullWidth(false);
	}, [match.params.mangaName]);

	if (!profileData.isLoading && !profileData.currentProfile) {
		history.push('/');
		return null;
	}

	return (
		<main className={styles.main} data-isfullwidth={isFullWidth}>
			<Title>{match.params.chapter + ' - ' + match.params.mangaName}</Title>

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
	chapters: { prev, curr, next },
	isLoading,
	originalUrl,
	isTop,
	isFullWidth,
	setIsFullWidth,
	storeFullWidthData,
}) {
	return (
		<header className={styles.header}>
			{isTop && <h2 className={styles.title}>{curr || ' '}</h2>}

			{isTop && (
				<div className={styles.container} style={{ marginBottom: 30 }}>
					<a
						href={originalUrl}
						target='_blank'
						rel='nofollow noreferrer noopener'
						className='button'
						disabled={isLoading || !originalUrl}
					>
						<img
							src={window.location.origin + '/icons/open_in_new_white_24dp.svg'}
							alt='Open original'
						/>
					</a>

					<button
						className='button'
						onClick={() => {
							storeFullWidthData(!isFullWidth);
							setIsFullWidth(!isFullWidth);
						}}
					>
						<img
							src={
								window.location.origin +
								'/icons/' +
								(isFullWidth
									? 'close_fullscreen_white_24dp.svg'
									: 'open_in_full_white_24dp.svg')
							}
							alt='Toggle full-width'
						/>
					</button>
				</div>
			)}

			<div className={styles.container}>
				<Link
					to={prev || '#'}
					className='button icon-left'
					disabled={isLoading || !prev}
				>
					<img
						src={window.location.origin + '/icons/arrow_back-white-24dp.svg'}
						alt='<-'
					/>
					<span>Prev</span>
				</Link>

				<Link to='/' className='button'>
					<img
						src={window.location.origin + '/icons/home-white-24dp.svg'}
						alt='Home'
					/>
				</Link>

				<Link
					to={next || '#'}
					className='button icon-right'
					disabled={isLoading || !next}
				>
					<span>Next</span>
					<img
						src={window.location.origin + '/icons/arrow_forward-white-24dp.svg'}
						alt='->'
					/>
				</Link>
			</div>
		</header>
	);
}
