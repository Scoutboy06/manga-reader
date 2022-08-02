import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import Navbar from '../../components/Navbar';

import styles from './settings.module.css';

export default function Settings() {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<button
					className={'button ' + styles.homeBtn}
					onClick={() => {
						const path = location.pathname.slice(1).split('/');

						if (path.length === 2) {
							navigate('/');
						} else {
							const newPath = path.slice(0, path.length - 1);
							navigate('/' + newPath.join('/'));
						}
					}}
				>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
						<path d='M0 0h24v24H0V0z' fill='none' />
						<path d='M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z' />
					</svg>
				</button>

				<Navbar>
					<a href='/settings/application'>Application</a>
					<a href='/settings/hosts'>Hosts</a>
					<a href='/settings/profiles'>Profiles</a>
				</Navbar>
			</header>

			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	);
}
