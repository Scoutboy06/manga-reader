import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import fetchAPI from '../../../functions/fetchAPI';

import ChooseProfilePicture from '../../../components/Popups/ChooseProfilePicture';

import { PopupContext } from '../../../contexts/PopupContext';
import { ProfileContext } from '../../../contexts/ProfileContext';
import { AlertContext } from '../../../contexts/AlertContext';

import styles from '../settings.module.css';

export default function Profile() {
	const params = useParams();

	const [{ profiles }] = useContext(ProfileContext);
	const [, popupActions] = useContext(PopupContext);
	const [, alertActions] = useContext(AlertContext);

	const [username, setUsername] = useState('');
	const [profilePicture, setProfilePicture] = useState();
	const [discordUserId, setDiscordUserId] = useState('');
	const [currentProfile, setCurrentProfile] = useState();

	const saveHandler = () => {
		fetchAPI(`/users/${currentProfile._id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				name: username,
				imageUrl: profilePicture,
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
		const selectedProfile = profiles.find(
			profile => profile._id === params._id
		);
		setCurrentProfile(selectedProfile);
		setUsername(selectedProfile.name);
		setDiscordUserId(selectedProfile.discordUserId || '');
		setProfilePicture(selectedProfile.imageUrl);
	}, [params._id, profiles]);

	if (!currentProfile) return null;

	return (
		<>
			<div className={styles.formGroup}>
				<label htmlFor='name'>Profile name:</label>
				<input
					type='text'
					name='username'
					id='name'
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Current profile picture:</label>
				<img
					src={profilePicture}
					width={200}
					height={200}
					alt={currentProfile.name}
				/>
				<button
					onClick={() => {
						popupActions.createPopup({
							title: 'Change profile picture',
							content: ChooseProfilePicture,
							callback: imgSrc => setProfilePicture(imgSrc),
						});
					}}
				>
					Pick a new one
				</button>
			</div>

			<div className={styles.formGroup}>
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
				<button type='submit' onClick={() => saveHandler()}>
					Save changes
				</button>
			</footer>
		</>
	);
}
