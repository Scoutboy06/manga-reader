import { useState, useEffect, useContext } from 'react';
import fetchAPI from '../../functions/fetchAPI';

import Head from '../../components/Head';
import MangaCard from '../../components/MangaCard';
import NewMangaPopup from '../../components/Popups/NewMangaPopup';

import { ProfileContext } from '../../contexts/ProfileContext';
import { PopupContext } from '../../contexts/PopupContext';

import styles from './index.module.css';

export default function Mangas() {
	const [mangas, setMangas] = useState([]);
	const [updates, setUpdates] = useState([]);
	const [showFinishedMangas, setShowFinishedMangas] = useState(false);
	const [isFetchingUpdates, setIsFetchingUpdates] = useState(false);

	const [profileData] = useContext(ProfileContext);
	const [, popupActions] = useContext(PopupContext);

	useEffect(() => {
		fetchAPI(`/users/${profileData.currentProfile._id}/mangas`, {}, false).then(
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
							.filter(manga => manga.isSubscribed)
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
						!manga.hasFinishedReading && (
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

				<div>
					{mangas.map(
						manga =>
							manga.hasFinishedReading && (
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

			<button
				className={styles.newManga}
				onClick={() => {
					popupActions.createPopup({
						title: 'Search for a new manga',
						content: NewMangaPopup,
					});
				}}
			>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
					<g>
						<g>
							<path d='M18,13h-5v5c0,0.55-0.45,1-1,1l0,0c-0.55,0-1-0.45-1-1v-5H6c-0.55,0-1-0.45-1-1l0,0c0-0.55,0.45-1,1-1h5V6 c0-0.55,0.45-1,1-1l0,0c0.55,0,1,0.45,1,1v5h5c0.55,0,1,0.45,1,1l0,0C19,12.55,18.55,13,18,13z' />
						</g>
					</g>
				</svg>
			</button>
		</>
	);
}
