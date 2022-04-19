import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ApplicationSettings from './ApplicationSettings';
import ProfilesSettings from './ProfilesSettings';

// import { ProfileContext } from '../../contexts/ProfileContext';
// import { PopupContext } from '../../contexts/PopupContext';

import styles from './settings.module.css';

export default function Settings() {
	const params = useParams();
	const navigate = useNavigate();
	// const [profileData, profileActions] = useContext(ProfileContext);
	// const [, popupActions] = useContext(PopupContext);

	useEffect(() => {
		if (!params.type) navigate('/settings/application', { replace: true });
	}, [navigate, params.type]);

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<button
					className={'button ' + styles.homeBtn}
					onClick={() => navigate('/library')}
				>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
						<path d='M0 0h24v24H0V0z' fill='none' />
						<path d='M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z' />
					</svg>
				</button>

				<button
					onClick={() => navigate('/settings/application')}
					data-active={params.type === 'application'}
				>
					Application
				</button>

				<button
					onClick={() => navigate('/settings/profiles')}
					data-active={params.type === 'profiles'}
				>
					Profiles
				</button>
			</header>

			<main className={styles.main}>
				{params.type === 'application' ? (
					<ApplicationSettings />
				) : params.type === 'profiles' ? (
					<ProfilesSettings />
				) : null}
			</main>
		</div>
	);
}