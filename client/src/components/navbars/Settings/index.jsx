import { NavLink, useNavigate, useLocation } from 'react-router-dom';

import styles from './SettingsNavbar.module.css';

export default function SettingsNavbar({ className }) {
	const navigate = useNavigate();
	const location = useLocation();
	const path = location.pathname.slice(1).split('/');

	return (
		<nav className={styles.navbar}>
			<button
				className={styles.button}
				onClick={() => {
					if (path.length === 2) {
						navigate('/');
					} else {
						const newPath = path.slice(0, path.length - 1);
						navigate('/' + newPath.join('/'));
					}
				}}
			>
				<i className='icon' style={{ fontSize: 28 }}>
					chevron_left
				</i>
			</button>

			<div className={className ? ' ' + className : ''}>
				<NavLink to='/settings/application' className={styles.navlink}>
					Application
				</NavLink>
				<NavLink to='/settings/hosts' className={styles.navlink}>
					Hosts
				</NavLink>
				<NavLink to='/settings/profiles' className={styles.navlink}>
					Profiles
				</NavLink>
			</div>

			<div style={{ width: 45 }}></div>
		</nav>
	);
}
