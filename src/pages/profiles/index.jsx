import { useEffect, useContext } from 'react';
import { ProfileContext } from '../../contexts/ProfileContext';
import { useHistory } from 'react-router-dom';

import Title from '../../components/Title';

import styles from './Profiles.module.css';

export default function Profiles() {
	const history = useHistory();
	const [profileData, profileActions] = useContext(ProfileContext);

	useEffect(() => {
		if (!profileData.isLoading && profileData?.currentProfile?._id)
			history.push('/library');
	}, [history, profileData]);

	if (profileData.isLoading || profileData?.currentProfile?._id) {
		return null;
	}

	return (
		<main className={styles.profilesMain}>
			<Title>Choose a profile</Title>

			<h1 className={styles.title}>Choose a profile</h1>

			<div className={styles.profiles}>
				{profileData?.profiles &&
					profileData.profiles.map((profile, index) => (
						<div
							key={index}
							className={styles.profile}
							onClick={() => profileActions.selectProfile(profile)}
						>
							<img src={profile.imageUrl} alt='' />
							<p key={index}>{profile.name}</p>
						</div>
					))}

				<div className={styles.profile} onClick={() => alert('Coming soon')}>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
						<path d='M0 0h24v24H0V0z' fill='none' />
						<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z' />
					</svg>
					<p>Add a profile</p>
				</div>
			</div>
		</main>
	);
}
