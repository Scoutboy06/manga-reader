import { useRouter } from 'next/router';
import Head from 'next/head';

import { useProfile } from '@/contexts/ProfileContext';

import styles from '@/styles/ProfilePicker.module.css';

export default function Profiles() {
	const router = useRouter();

	const [{ profiles }, { selectProfile }] = useProfile();

	const profileSelectHandler = profile => {
		selectProfile(profile);

		const { redirect } = router.query;
		if (redirect) router.push(redirect);
		else router.push('/mangas');
	};

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
								onClick={() => profileSelectHandler(profile)}
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
