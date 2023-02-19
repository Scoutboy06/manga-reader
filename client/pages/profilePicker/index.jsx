import { useEffect, useContext } from 'react';
import { ProfileContext } from '@/contexts/ProfileContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Head from 'next/head';

import styles from './Profiles.module.css';

const useQuery = () => new URLSearchParams(useLocation().search);

export default function Profiles() {
	const navigate = useNavigate();
	const location = useLocation();
	const query = useQuery();

	const [{ profiles }, { selectProfile }] = useContext(ProfileContext);

	const selectProfileHandler = profile => {
		selectProfile(profile);

		const redirect = query.get('redirect');
		if (redirect) navigate(redirect);
	};

	useEffect(() => {
		if (location && location.pathname.length > 1) {
			navigate('/?redirect=' + location.pathname, { replace: true });
		}
	}, [location, navigate, query]);

	return (
		<main className={styles.profilesMain}>
			<Head>
				<title>Choose a profile</title>
			</Head>

			<h1 className={styles.title}>Choose a profile</h1>

			<div className={styles.profiles}>
				{profiles &&
					profiles.map((profile, index) => (
						<div
							key={index}
							className={styles.profile}
							onClick={() => selectProfileHandler(profile)}
						>
							<img src={profile.imageUrl} alt='Profile' />
							<p key={index}>{profile.name}</p>
						</div>
					))}
			</div>
		</main>
	);
}
