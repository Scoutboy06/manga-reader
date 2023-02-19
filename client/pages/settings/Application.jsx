import { useState, useContext } from 'react';
import Head from 'next/head';

import { SettingsContext } from '../../contexts/SettingsContext';
import { AlertContext } from '../../contexts/AlertContext';

import styles from './settings.module.css';

const appIcons = ['rikka_square', 'book'];

export default function ApplicationSettings() {
	const [settings, settingsActions] = useContext(SettingsContext);
	const [, alertActions] = useContext(AlertContext);
	const [appIcon, setAppIcon] = useState(settings.appIcon);

	const saveHandler = () => {
		settingsActions.setAppIcon(appIcon);
		alertActions.createAlert({
			text: 'Your settings has been updated',
		});
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
