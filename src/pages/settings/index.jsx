import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { ProfileContext } from '../../contexts/ProfileContext';
import { PopupContext } from '../../contexts/PopupContext';

import styles from './settings.module.css';

export default function Settings({ match, location }) {
	const history = useHistory();
	const [profileData, profileActions] = useContext(ProfileContext);
	// const [, popupActions] = useContext(PopupContext);

	useEffect(() => {
		if (!match.params.type) return history.replace('/settings/application');
	}, [history, match]);

	return (
		<main className={styles.main}>
			<header className={styles.header}>
				<button
					className={'button ' + styles.homeBtn}
					onClick={() => history.push('/library')}
				>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
						<path d='M0 0h24v24H0V0z' fill='none' />
						<path d='M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z' />
					</svg>
				</button>

				<button
					onClick={() => history.push('/settings/application')}
					data-active={match.params.type === 'application'}
				>
					Application
				</button>

				<button
					onClick={() => history.push('/settings/profiles')}
					data-active={match.params.type === 'profiles'}
				>
					Profiles
				</button>
			</header>

			{JSON.stringify(match)}
			<br />
			{JSON.stringify(location)}
		</main>
	);
}
