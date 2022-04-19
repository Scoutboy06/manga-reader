import { useState } from 'react';

import Head from '../../components/Head';

// import { ProfileContext } from '../../contexts/ProfileContext';
// import { PopupContext } from '../../contexts/PopupContext';

import styles from './settings.module.css';

const appIcons = ['/appIcons/book_128.png', '/appIcons/rikka_square128.png'];

export default function ApplicationSettings() {
	// const navigate = useNavigate();
	// const [profileData, profileActions] = useContext(ProfileContext);
	// const [, popupActions] = useContext(PopupContext);

	const [appIcon, setAppIcon] = useState(appIcons[1]);

	const saveHandler = () => {
		localStorage.setItem(
			'settings',
			JSON.stringify({
				appIcon,
			})
		);
	};

	return (
		<>
			<Head>
				<title>Application settings</title>
				<link rel='shortcut icon' href={appIcon} type='image/png' />
				<link rel='apple-touch-icon' href={appIcon} type='image/png' />
				<link rel='apple-touch-startup-image' href={appIcon} type='image/png' />
				<meta name='msapplication-TileImage' content={appIcon} />
			</Head>

			<div className={styles.formGroup}>
				<label>App icon:</label>
				<div className={styles.appIcons}>
					{appIcons.map((icon, index) => (
						<button
							className={styles.appIcon}
							onClick={() => setAppIcon(appIcons[index])}
							key={index}
						>
							<img src={icon} alt='Failed to load' key={index} />
						</button>
					))}
				</div>
			</div>

			<footer className={styles.footer}>
				<button type='submit' onClick={() => saveHandler()}>
					Save changes
				</button>
			</footer>
		</>
	);
}
