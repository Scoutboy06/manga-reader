import { useState, useEffect } from 'react';

import MangaCard from '../../components/MangaCard';
import SearchMangaOverlay from '../../components/SearchMangaOverlay';

import styles from './index.module.css';

export default function Home() {
	const [mangas, setMangas] = useState([]);
	const [updates, setUpdates] = useState([]);
	const [showOverlay, setShowOverlay] = useState(false);
	const [showFinishedMangas, setShowFinishedMangas] = useState(false);

	const [isFetchingUpdates, setIsFetchingUpdates] = useState(false);

	const fetchMangas = () =>
		fetch('api/manga')
			.then(raw => raw.json())
			.catch(console.error);

	const fetchSingles = () =>
		fetch('api/single')
			.then(raw => raw.json())
			.catch(console.error);

	const fetchUpdates = async cache => {
		setIsFetchingUpdates(true);

		try {
			const raw = await fetch(
				'api/getUpdates?' + (cache ? 'cache=true' : 'cache=false')
			);
			const json = await raw.json();
			setIsFetchingUpdates(false);
			setUpdates(json);
		} catch (message) {
			return console.error(message);
		}
	};

	useEffect(() => {
		async function fetchData() {
			const m = await fetchMangas();
			const s = await fetchSingles();

			setMangas([...m, ...s]);

			await fetchUpdates(true);
			// setIsFetchingUpdates(true);
		}

		fetchData();
	}, []);

	return (
		<main className={styles.main}>
			<header>
				<h2 className={styles.title}>Choose manga</h2>
				<button
					className='button'
					disabled={isFetchingUpdates}
					onClick={() => fetchUpdates(false)}
				>
					<img
						src={window.location.origin + '/icons/refresh_white_24dp.svg'}
						alt='Refresh'
					/>
				</button>
			</header>

			<section>
				{mangas.length > 0 &&
					mangas.map(
						manga =>
							!manga.finished && (
								<MangaCard
									key={manga._id}
									manga={manga}
									isFetchingUpdates={isFetchingUpdates}
									updates={updates}
								/>
							)
					)}
			</section>

			<section className={styles.section2}>
				<button
					onClick={() => setShowFinishedMangas(!showFinishedMangas)}
					className={styles.toggleFinshedMangasButton}
				>
					<span>{showFinishedMangas ? 'Hide' : 'Show'} </span>
					<img
						src='icons/expand_more_white_24dp.svg'
						alt='v'
						width={30}
						style={{ transform: `rotate(${showFinishedMangas ? 0 : -90}deg)` }}
					/>
				</button>

				<div>
					{mangas.length > 0 &&
						showFinishedMangas &&
						mangas.map(
							manga =>
								manga.finished && (
									<MangaCard
										key={manga._id}
										manga={manga}
										isFetchingUpdates={isFetchingUpdates}
										updates={updates}
									/>
								)
						)}
				</div>
			</section>

			<SearchMangaOverlay
				visible={showOverlay}
				setVisibility={setShowOverlay}
			/>

			<button className={styles.newManga} onClick={() => setShowOverlay(true)}>
				<img src='/icons/add-white-24dp.svg' alt='+' />
			</button>
		</main>
	);
}
