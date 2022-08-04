import { useState, useEffect, useContext } from 'react';
// import { useNavigate, Outlet } from 'react-router-dom';
import fetchAPI from '../../functions/fetchAPI';

import Head from '../../components/Head';
import MangaCard from '../../components/MangaCard';

import { ProfileContext } from '../../contexts/ProfileContext';

import styles from './index.module.css';

export default function Mangas() {
	const [mangas, setMangas] = useState([]);
	const [updates, setUpdates] = useState([]);
	const [showFinishedMangas, setShowFinishedMangas] = useState(false);

	const [isFetchingUpdates, setIsFetchingUpdates] = useState(false);

	const [profileData] = useContext(ProfileContext);

	useEffect(() => {
		fetchAPI(`/users/${profileData.currentProfile._id}/mangas`, {}, true).then(
			setMangas
		);
	}, [profileData.currentProfile]);

	useEffect(() => {
		async function fetchUpdates(cache) {
			setIsFetchingUpdates(true);

			fetchAPI(
				'/getUpdates?' +
					new URLSearchParams({
						cache,
						mangas: mangas
							.filter(manga => manga.subscribed)
							.map(manga => manga._id),
					})
			).then(json => {
				setIsFetchingUpdates(false);
				setUpdates(json);
			});
		}

		if (mangas && mangas.length > 0) fetchUpdates(true);
	}, [mangas]);

	return (
		<>
			<Head>
				<title>Choose a manga</title>
			</Head>

			<section className={styles.section1}>
				{mangas.map(
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

			<section className={styles.section2} data-show={showFinishedMangas}>
				<button
					onClick={() => setShowFinishedMangas(!showFinishedMangas)}
					className={styles.toggleFinshedMangasButton}
				>
					<span>Finished reading</span>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						width='30px'
						style={{
							transform: `rotate(${showFinishedMangas ? 0 : -90}deg)`,
						}}
					>
						<path d='M24 24H0V0h24v24z' fill='none' opacity='.87' />
						<path d='M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z' />
					</svg>
				</button>

				{mangas && (
					<div>
						{mangas.map(
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
				)}
			</section>
		</>
	);
}
