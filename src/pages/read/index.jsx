import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Loader from '../../components/Loader';

import styles from './index.module.css';

export default function Read({ match, location }) {
	const [chapters, setChapters] = useState({
		prev: null,
		curr: match.params.chapter,
		next: null,
	});
	const [images, setImages] = useState([]);
	const [originalUrl, setOriginalUrl] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const [isFullWidth, setIsFullWidth] = useState(false);

	const fetchChapters = () =>
		fetch(
			`${window.location.origin}/api/manga/${match.params.mangaName}/${match.params.chapter}`
		)
			.then(res => res.json())
			.catch(console.error);

	const updateProgress = isLast =>
		fetch(window.location.origin + '/api/manga/updateProgress', {
			method: 'POST',
			body: JSON.stringify({
				urlName: match.params.mangaName,
				chapter: match.params.chapter,
				isLast,
			}),
			headers: { 'Content-Type': 'application/json' },
		}).catch(console.error);

	const storeFullWidthData = isFullWidth => {
		const json = JSON.parse(localStorage.getItem('isFullWidth'));
		json[match.params.mangaName] = isFullWidth;
		localStorage.setItem('isFullWidth', JSON.stringify(json));
	};

	useEffect(() => {
		(async function () {
			setIsLoading(true);

			const chaps = await fetchChapters();
			setChapters({
				prev: chaps.prevPath,
				curr: match.params.chapter,
				next: chaps.nextPath,
			});
			setImages(chaps.images);
			setOriginalUrl(chaps.originalUrl);

			setIsLoading(false);

			updateProgress(!chaps.nextPath);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match.params]);

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

	return (
		<main className={styles.main} data-isFullWidth={isFullWidth}>
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
					{images.map((image, index) => (
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
			{isTop && <h2 className={styles.title}>{curr}</h2>}

			{isTop && (
				<div className={styles.container} style={{ marginBottom: 30 }}>
					<a
						href={originalUrl}
						target='_blank'
						rel='nofollow noreferrer noopener'
						className={styles.pagination}
						disabled={isLoading || !originalUrl}
					>
						<img
							src={window.location.origin + '/icons/open_in_new_white_24dp.svg'}
							alt='Open original'
						/>
					</a>

					<button
						className={styles.pagination}
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
					className={styles.pagination}
					disabled={isLoading || !prev}
				>
					<img
						src={window.location.origin + '/icons/arrow_back-white-24dp.svg'}
						alt='<-'
					/>
					<span>Prev</span>
				</Link>

				<Link to='/' className={styles.pagination}>
					<img
						src={window.location.origin + '/icons/home-white-24dp.svg'}
						alt='Home'
					/>
				</Link>

				<Link
					to={next || '#'}
					className={styles.pagination}
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
