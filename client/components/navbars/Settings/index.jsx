// import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useRouter } from 'next/router';

import { useProfile } from '@/contexts/ProfileContext';

import Navlink from '@/components/Navlink';

import styles from './SettingsNavbar.module.css';

export default function SettingsNavbar({ className }) {
	const router = useRouter();
	const path = router.pathname.slice(1).split('/');

	const [{ currentProfile }] = useProfile();

	return (
		<nav className={styles.navbar}>
			<button
				className={styles.button}
				onClick={() => {
					if (path.length === 2) {
						router.push('/');
					} else {
						const newPath = path.slice(0, path.length - 1);
						router.push('/' + newPath.join('/'));
					}
				}}
			>
				<i className='icon' style={{ fontSize: 28 }}>
					chevron_left
				</i>
			</button>

			<div className={className ? ' ' + className : ''}>
				<Navlink href='/settings/profile' className={styles.navlink}>
					Profile
				</Navlink>

				{currentProfile?.isAdmin && (
					<>
						<Navlink href='/settings/hosts' className={styles.navlink}>
							Hosts
						</Navlink>
						<Navlink
							href='/settings/mangas'
							className={styles.navlink}
							subpaths={true}
						>
							Mangas
						</Navlink>
						<Navlink href='/settings/animes' className={styles.navlink}>
							Animes
						</Navlink>
					</>
				)}
			</div>

			<div style={{ width: 45 }}></div>
		</nav>
	);
}
