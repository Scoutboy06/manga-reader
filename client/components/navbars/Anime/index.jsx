import { Link, useLocation } from 'react-router-dom';

import styles from './AnimeNavbar.module.css';

export default function AnimeNavbar() {
	const location = useLocation();
	const path = location.pathname.slice(1).split('/');

	return (
		<nav className={styles.navbar}>
			<div className={styles.buttonContainer}>
				<Link
					to={`/${path.slice(0, path.length - 1).join('/')}`}
					className={styles.button}
				>
					<i className='icon' style={{ fontSize: 28 }}>
						chevron_left
					</i>
				</Link>
				<Link to={`/${path[0]}`} className={styles.button}>
					<i className='icon'>home</i>
				</Link>
			</div>

			<div className={styles.buttonContainer}>
				<button className={styles.button}>
					<i className='icon'>search</i>
				</button>
			</div>
		</nav>
	);
}
