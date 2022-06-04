import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import ChooseProfilePicture from '../../../components/Popups/ChooseProfilePicture';
import { PopupContext } from '../../../contexts/PopupContext';
import { ProfileContext } from '../../../contexts/ProfileContext';

import styles from '../settings.module.css';

export default function Profile() {
	const params = useParams();

	const [{ profiles }] = useContext(ProfileContext);
	const [, popupActions] = useContext(PopupContext);

	const [username, setUsername] = useState('');
	const [discordUserId, setDiscordUserId] = useState('');
	const [currentProfile, setCurrentProfile] = useState();

	const saveHandler = () => {
		console.log('Save...');
	};

	useEffect(() => {
		const currProfile = profiles.find(profile => profile._id === params._id);
		setCurrentProfile(currProfile);
		setUsername(currProfile.name);
		setDiscordUserId(currProfile.discordUserId || '');
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
					src={currentProfile.imageUrl}
					width={200}
					height={200}
					alt={currentProfile.name}
				/>
				<button
					onClick={() => {
						popupActions.createPopup({
							title: 'Change profile picture',
							content: ChooseProfilePicture,
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
