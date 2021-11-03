import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// import NewMangaOverlay from '../../components/NewMangaOverlay';
import Loader from '../../components/Loader';

import styles from './index.module.css';



export default function Home() {

	const [ mangas, setMangas ] = useState([]);
	const [ updates, setUpdates ] = useState([]);

	const [ isFetchingUpdates, setIsFetchingUpdates ] = useState(false);

	
	const fetchMangas = () =>
		fetch(`${window.location.origin}/api/manga`)
			.then(raw => raw.json())
			.catch(console.error);


	const fetchSingles = () =>
		fetch(`${window.location.origin}/api/single`)
			.then(raw => raw.json())
			.catch(console.error);


	const fetchUpdates = () =>
		fetch(`${window.location.origin}/api/getUpdates`)
			.then(raw => raw.json())
			.catch(console.error);


	useEffect(() => {
		async function fetchData() {
			const m = await fetchMangas();
			const s = await fetchSingles();

			setMangas([...m, ...s]);
			
			setIsFetchingUpdates(true);
			const u = await fetchUpdates();
			setUpdates(u);
			setIsFetchingUpdates(false);

		}

		fetchData();
	}, []);

	return (
		<main className={styles.main}>
			<header>
				<h2 className={styles.title}>Choose manga</h2>
			</header>

			<section>
				{mangas.length > 0 && mangas.map((manga, index) => (
					<Link to={ `/${manga.urlName}/${manga.chapter}` } key={manga._id || index} className={styles.item}>

						{ !isFetchingUpdates && updates.indexOf(manga._id) > -1 && (
							<div className={styles.updates}></div>
						)}

						{ manga.subscribed && isFetchingUpdates && (
							<div className={styles.loader}>
								<Loader size={30} />
							</div>
						)}

						

						<div className={styles.img}>
							<img src={ manga.coverUrl } alt="Img" />
						</div>

						<footer>
							<span>{ manga.name }</span>
						</footer>
					</Link>
				))}
			</section>

			{/* <NewMangaOverlay /> */}

			{/* <button className={styles.newManga}>
				<img src="/icons/add-white-24dp.svg" alt="+" />
			</button> */}
		</main>
	);
}