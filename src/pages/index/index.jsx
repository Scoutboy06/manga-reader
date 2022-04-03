import { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import MangaCard from '../../components/MangaCard';
import SearchMangaOverlay from '../../components/SearchMangaOverlay';
import Title from '../../components/Title';
import ContextMenu from '../../components/Dropdown';

import { ProfileContext } from '../../contexts/ProfileContext';

import styles from './index.module.css';

export default function Library() {
	const history = useHistory();
	const [profileData, profileActions] = useContext(ProfileContext);

	const [mangas, setMangas] = useState([]);
	const [updates, setUpdates] = useState([]);
	const [showOverlay, setShowOverlay] = useState(false);
	const [showFinishedMangas, setShowFinishedMangas] = useState(false);

	const [isFetchingUpdates, setIsFetchingUpdates] = useState(false);

	const [showProfileDropdown, setShowProfileDropdown] = useState(false);

	const fetchUpdates = async cache => {
		setIsFetchingUpdates(true);

		const raw = await fetch(
			'api/getUpdates?' +
				new URLSearchParams({
					cache,
					mangas: mangas
						.filter(manga => manga.subscribed)
						.map(manga => manga._id),
				})
		);
		const json = await raw.json();

		setIsFetchingUpdates(false);
		setUpdates(json);
	};

	const fetchData = async () => {
		const res = await fetch(
			`api/users/${profileData.currentProfile._id}/mangas`
		);
		const json = await res.json();
		setMangas(json);
	};

	useEffect(() => {
		if (profileData.isLoading) return;
		else if (!profileData.currentProfile?._id) history.push('/');
		else fetchData();
	}, [history, profileData]);

	useEffect(() => {
		if (mangas.length > 0) fetchUpdates(true);
	}, [mangas]);

	if (!profileData.currentProfile) return null;

	return (
		<main className={styles.main}>
			<Title>Choose a manga</Title>

			<header className={styles.header}>
				<button
					className={styles.profileDropdown}
					onClick={() => setShowProfileDropdown(true)}
					onBlur={() => setShowProfileDropdown(false)}
				>
					<img src={profileData.currentProfile.imageUrl} alt='Profile' />
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						style={{ transform: `rotate(${showProfileDropdown * 180}deg)` }}
					>
						<path d='M24 24H0V0h24v24z' fill='none' opacity='.87' />
						<path d='M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z' />
					</svg>

					{/* {true && ( */}
					{showProfileDropdown && (
						<ContextMenu
							items={[
								...profileData.profiles.map(profile => ({
									icon: <img src={profile.imageUrl} alt='Profile' />,
									content: profile.name,
									action: () => profileActions.selectProfile(profile),
								})),
								'divider',
								{
									icon: (
										<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
											<path d='M0 0h24v24H0V0z' fill='none' />
											<path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z' />
										</svg>
									),
									content: (
										<Link to={`/profile/${profileData.currentProfile._id}`}>
											Profile
										</Link>
									),
								},
								{
									icon: (
										<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
											<path d='M0 0h24v24H0V0z' fill='none' />
											<path d='M10.79 16.29c.39.39 1.02.39 1.41 0l3.59-3.59c.39-.39.39-1.02 0-1.41L12.2 7.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L12.67 11H4c-.55 0-1 .45-1 1s.45 1 1 1h8.67l-1.88 1.88c-.39.39-.38 1.03 0 1.41zM19 3H5c-1.11 0-2 .9-2 2v3c0 .55.45 1 1 1s1-.45 1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z' />
										</svg>
									),
									content: 'Exit profile',
									action: () => profileActions.deselectProfile(),
								},
							]}
						/>
					)}
				</button>

				<h2 className={styles.title}>Choose a manga</h2>
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
					<span>Completed</span>
					<img
						src='/icons/expand_more_white_24dp.svg'
						alt='v'
						width={30}
						style={{ transform: `rotate(${showFinishedMangas ? 0 : -90}deg)` }}
					/>
				</button>

				{mangas.length > 0 && showFinishedMangas && (
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
