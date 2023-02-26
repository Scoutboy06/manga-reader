import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { ProfileContext } from '@/contexts/ProfileContext';

import styles from '@/styles/ProfilePicker.module.css';

export default function Profiles() {
	const router = useRouter();

	const [{ profiles }, { selectProfile }] = useContext(ProfileContext);

	const selectProfileHandler = profile => {
		selectProfile(profile);

		const redirect = router.query.redirect;
		if (redirect) router.push(redirect);
		else router.push('/mangas');
	};

	useEffect(() => {
		if (router.pathname.length > 1) {
			router.push('/?redirect=' + location.pathname, { replace: true });
		}
	}, [router.pathname]);

	return (
		<>
			<Head>
				<title>Choose a profile</title>
			</Head>

			<main className={styles.profilesMain}>
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
		</>
	);
}
