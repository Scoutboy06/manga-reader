import { useLocation, useNavigate, NavLink } from 'react-router-dom';

import styles from './watch.module.css';
import navstyles from '../navbar.module.css';

export default function Navbar() {
	const navigate = useNavigate();
	const location = useLocation();
	const path = location.pathname.slice(1).split('/');

	return (
		<nav className={[styles.navbar, navstyles.navbar].join(' ')}>
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

			{/* <div>
				<NavLink to='/settings/application' className={styles.navlink}>
					Application
				</NavLink>
				<NavLink to='/settings/hosts' className={styles.navlink}>
					Hosts
				</NavLink>
				<NavLink to='/settings/profiles' className={styles.navlink}>
					Profiles
				</NavLink>
			</div> */}

			<div style={{ width: 45 }}></div>
		</nav>
	);
}
