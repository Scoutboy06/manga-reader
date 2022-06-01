import { useState, useContext } from 'react';

import Head from '../../components/Head';

// import { ProfileContext } from '../../contexts/ProfileContext';
// import { PopupContext } from '../../contexts/PopupContext';
import { SettingsContext } from '../../contexts/SettingsContext';

import styles from './settings.module.css';

const appIcons = ['rikka_square', 'book'];

export default function ApplicationSettings() {
	const [settings, settingsActions] = useContext(SettingsContext);
	const [appIcon, setAppIcon] = useState(settings.appIcon);

	const saveHandler = () => {
		settingsActions.setAppIcon(appIcon);
	};

	return (
		<>
			<Head>
				<title>Application settings</title>
			</Head>

			<div className={styles.formGroup}>
				<label>App icon:</label>
				<div className={styles.appIcons}>
					{appIcons.map((icon, index) => (
						<button
							className={styles.item}
							onClick={() => setAppIcon(icon)}
							key={index}
							data-isselected={appIcon === icon}
						>
							<img
								src={`/appIcons/${icon}_128.png`}
								alt='Failed to load'
								key={index}
							/>
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
