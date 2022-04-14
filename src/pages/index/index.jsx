import { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import fetchAPI from '../../functions/fetchAPI';

import MangaCard from '../../components/MangaCard';
import NewMangaPopup from '../../components/Popups/NewMangaPopup';
// import PopupOverlay from '../../components/PopupOverlay';
import Title from '../../components/Title';
import Dropdown from '../../components/Dropdown';
import BlurContainer from '../../components/BlurContainer';

import { ProfileContext } from '../../contexts/ProfileContext';
import { PopupContext } from '../../contexts/PopupContext';

import styles from './index.module.css';

export default function Library() {
	const history = useHistory();
	const [profileData, profileActions] = useContext(ProfileContext);
	const [popupState, popupActions] = useContext(PopupContext);

	const [mangas, setMangas] = useState();
	const [updates, setUpdates] = useState([]);
	const [showFinishedMangas, setShowFinishedMangas] = useState(false);

	const [isFetchingUpdates, setIsFetchingUpdates] = useState(false);

	const [showProfileDropdown, setShowProfileDropdown] = useState(false);

	const fetchUpdates = async cache => {
		setIsFetchingUpdates(true);

		fetchAPI(
			'api/getUpdates?' +
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
	};

	const fetchData = async () => {
		fetchAPI(`api/users/${profileData.currentProfile._id}/mangas`).then(
			setMangas
		);
	};

	useEffect(() => {
		if (profileData.isLoading) return;
		else if (!profileData.currentProfile?._id) history.push('/');
		else fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [history, profileData]);

	useEffect(() => {
		if (mangas && mangas.length > 0) fetchUpdates(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mangas]);

	if (!profileData.currentProfile) return null;

	return (
		<>
			<main className={styles.main}>
				<Title>Choose a manga</Title>

				<header className={styles.header}>
					<BlurContainer
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

						<Dropdown
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
									disabled: true,
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
							pos={{ x: 0, y: 35 }}
							isShown={showProfileDropdown}
						/>
					</BlurContainer>

					<h2 className={styles.title}>Choose a manga</h2>
					<button
						className={styles.reloadButton + ' button'}
						disabled={isFetchingUpdates}
						onClick={() => fetchUpdates(false)}
					>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M0 0h24v24H0V0z' fill='none' />
							<path d='M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z' />
						</svg>
					</button>
				</header>

				<section className={styles.section1}>
					{mangas &&
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

				<section className={styles.section2} data-show={showFinishedMangas}>
					<button
						onClick={() => setShowFinishedMangas(!showFinishedMangas)}
						className={styles.toggleFinshedMangasButton}
					>
						<span>Completed</span>
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

				<button
					className={styles.newManga}
					onClick={() => {
						popupActions.createPopup({
							title: 'Search for a new manga',
							content: NewMangaPopup,
						});
					}}
				>
					<img src='/icons/add-white-24dp.svg' alt='+' />
				</button>
			</main>
		</>
	);
}
