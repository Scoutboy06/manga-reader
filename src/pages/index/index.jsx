import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import SearchMangaOverlay from '../../components/SearchMangaOverlay';
import Loader from '../../components/Loader';

import styles from './index.module.css';

export default function Home() {
	const [mangas, setMangas] = useState([]);
	const [updates, setUpdates] = useState([]);
	const [showOverlay, setShowOverlay] = useState(false);

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
					className={styles.button}
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
					mangas.map((manga, index) => (
						<Link
							to={`/${manga.urlName}/${manga.chapter}`}
							key={manga._id || index}
							className={styles.item}
						>
							{!isFetchingUpdates && updates[manga._id] && (
								<div className={styles.updates}></div>
							)}

							{manga.subscribed && isFetchingUpdates && (
								<div className={styles.loader}>
									<Loader size={30} />
								</div>
							)}

							<div className={styles.img}>
								<img src={manga.coverUrl} alt='Img' />
							</div>

							<footer>
								<span>{manga.name}</span>
							</footer>
						</Link>
					))}
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
