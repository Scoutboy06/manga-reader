import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Title from '../../components/Title';

// import { ProfileContext } from '../../contexts/ProfileContext';
// import { PopupContext } from '../../contexts/PopupContext';

import styles from './settings.module.css';

const appIcons = ['/img/book_128.ico', '/img/rikka_square128.png'];

export default function ApplicationSettings() {
	const history = useHistory();
	// const [profileData, profileActions] = useContext(ProfileContext);
	// const [, popupActions] = useContext(PopupContext);

	const [appIcon, setAppIcon] = useState(appIcons[0]);

	return (
		<>
			<Title>Application settings</Title>

			<div className={styles.formGroup}>
				<label>App icon:</label>
				<div className={styles.appIcons}>
					{appIcons.map((icon, index) => (
						<button className={styles.appIcon}>
							<img src={icon} alt='Failed to load' key={index} />
						</button>
					))}
				</div>
			</div>

			<footer className={styles.footer}>
				<button type='submit'>Save changes</button>
			</footer>
		</>
	);
}
