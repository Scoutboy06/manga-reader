import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';

import Navbar from '@/components/navbars/Settings';

import styles from '@/styles/settings.module.css';

export default function Profile() {
	const [username, setUsername] = useState('');
	const [profilePicture, setProfilePicture] = useState();
	const [discordUserId, setDiscordUserId] = useState('');

	const saveHandler = () => {
		fetch(`/api/users/${currentProfile._id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				name: username,
				profilePicture,
				discordUserId,
			}),
		})
			.then(() => {
				alertActions.createAlert({
					text: 'Your profile has been updated',
				});
			})
			.catch(console.error);
	};

	useEffect(() => {
		if (!profiles || !currentProfile) return;

		const selectedProfile = profiles.find(
			profile => profile._id === currentProfile._id
		);
		setUsername(selectedProfile.name);
		setDiscordUserId(selectedProfile.discordUserId || '');
		setProfilePicture(selectedProfile.profilePicture);
	}, [currentProfile, profiles]);

	return (
		<>
			<Head>
				<title>Settings - profile</title>
			</Head>

			<Navbar />

			<main className={styles.main}>
				<div className='formGroup'>
					<label htmlFor='name'>Profile name:</label>
					<input
						type='text'
						name='username'
						id='name'
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
				</div>

				<div className='formGroup'>
					<label>Current profile picture:</label>
					<img
						src={profilePicture}
						width={200}
						height={200}
						alt={currentProfile?.name}
					/>
					<button
						onClick={() => {
							// popupActions.createPopup({
							// 	title: 'Change profile picture',
							// 	content: ChooseProfilePicture,
							// 	callback: imgSrc => setProfilePicture(imgSrc),
							// });
						}}
					>
						Pick a new one
					</button>
				</div>

				<div className='formGroup'>
					<label htmlFor='discordUserId'>Discord user ID (optional)</label>
					<input
						type='text'
						name='discordUserId'
						id='discordUserId'
						value={discordUserId}
						onChange={e => setDiscordUserId(e.target.value)}
					/>
				</div>

				<footer className={styles.footer}>
					<button
						type='submit'
						onClick={() => saveHandler()}
						className={styles.submitBtn}
					>
						Save changes
					</button>
				</footer>
			</main>
		</>
	);
}
