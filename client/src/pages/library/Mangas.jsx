import { useState, useEffect, useContext } from 'react';
import useSWR from 'swr';
import fetchAPI, { fetcher } from '../../functions/fetchAPI';

import Head from '../../components/Head';
import MangaCard from '../../components/MangaCard';
import NewMangaPopup from '../../components/Popups/NewMangaPopup';

import { ProfileContext } from '../../contexts/ProfileContext';
import { PopupContext } from '../../contexts/PopupContext';

import styles from './index.module.css';

export default function Mangas() {
	const [profileData] = useContext(ProfileContext);
	const [, popupActions] = useContext(PopupContext);

	// const [mangas, setMangas] = useState([]);
	const { data: mangas } = useSWR(
		`/users/${profileData.currentProfile._id}/mangas`
	);
	// const [updates, setUpdates] = useState([]);
	const { data: updates, error: updatesError } = useSWR(
		() =>
			'/getUpdates?' +
			new URLSearchParams({
				cache: true,
				mangas: mangas
					.filter(manga => manga.isSubscribed)
					.map(manga => manga._id),
			})
	);
	const isFetchingUpdates = !updates && !updatesError;
	const [showFinishedMangas, setShowFinishedMangas] = useState(false);

	return (
		<>
			<Head>
				<title>Choose a manga</title>
			</Head>

			<section className={styles.section1}>
				{mangas &&
					mangas.map(
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
					<i
						className='icon'
						style={{
							transform: `rotate(${showFinishedMangas ? 0 : -90}deg)`,
						}}
					>
						expand_more
					</i>
				</button>

				<div>
					{mangas &&
						mangas.map(
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
