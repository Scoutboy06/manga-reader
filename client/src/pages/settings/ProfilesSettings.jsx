import { useContext, useState, useEffect } from 'react';

import Head from '../../components/Head';
import ChooseProfilePicture from '../../components/Popups/ChooseProfilePicture';

import { ProfileContext } from '../../contexts/ProfileContext';
import { PopupContext } from '../../contexts/PopupContext';
// import { SettingsContext } from '../../contexts/SettingsContext';

import styles from './settings.module.css';

export default function ProfilesSettings() {
	// const [settings, settingsActions] = useContext(SettingsContext);
	const [, popupActions] = useContext(PopupContext);
	const [profilesData] = useContext(ProfileContext);
	const [currentProfile, setCurrentProfile] = useState();

	const [username, setUsername] = useState('');
	const [discordUserId, setDiscordUserId] = useState('');

	const saveHandler = () => {
		// settingsActions.setAppIcon(appIcon);
		console.log('Save...');
	};

	useEffect(() => {
		if (currentProfile) {
			setUsername(currentProfile.name);
			setDiscordUserId(currentProfile.discordUserId);
		}
	}, [currentProfile]);

	return (
		<>
			<Head>
				<title>Profile settings</title>
			</Head>

			{currentProfile ? (
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
						{/* eslint-disable-next-line jsx-a11y/alt-text */}
						<img src={currentProfile.imageUrl} width={200} height={200} />
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
			) : (
				<div className={styles.formGroup}>
					<label style={{ margin: '0 auto' }}>Select a profile</label>
					<div className={styles.profiles}>
						{profilesData.profiles &&
							profilesData.profiles.map((profile, index) => (
								<button
									className={styles.item}
									key={profile.name + index}
									onClick={() => setCurrentProfile(profile)}
								>
									<img src={profile.imageUrl} alt={profile.name} />
									<p>{profile.name}</p>
								</button>
							))}
					</div>
				</div>
			)}
		</>
	);
}
