import { useContext } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';

import Head from '../../../components/Head';

import { ProfileContext } from '../../../contexts/ProfileContext';

import styles from '../settings.module.css';

export default function ProfilesSettings() {
	const params = useParams();
	const [profilesData] = useContext(ProfileContext);

	return (
		<>
			<Head>
				<title>Profile settings</title>
			</Head>

			{params._id ? (
				<Outlet />
			) : (
				<div className={styles.formGroup}>
					<label style={{ margin: '0 auto' }}>Select a profile</label>
					<div className={styles.profiles}>
						{profilesData.profiles &&
							profilesData.profiles.map((profile, index) => (
								<Link
									to={`/settings/profiles/${profile._id}`}
									className={styles.item}
									key={profile.name + index}
								>
									<img src={profile.imageUrl} alt={profile.name} />
									<p>{profile.name}</p>
								</Link>
							))}
					</div>
				</div>
			)}
		</>
	);
}
