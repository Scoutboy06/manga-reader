// import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useRouter } from 'next/router';
import Link from 'next/link';

import styles from './navbar.module.css';

export default function SearchNavbar() {
	const router = useRouter();
	const path = router.pathname.slice(1).split('/');

	return (
		<nav
			className={styles.navbar}
			style={{ backgroundColor: 'var(--bg-02dp)' }}
		>
			<div className={styles.buttonContainer}>
				<button className={styles.button} onClick={() => router.back()}>
					<i className='icon' style={{ fontSize: 28 }}>
						chevron_left
					</i>
				</button>

				<Link className={styles.button + ' icon'} href='/mangas'>
					home
				</Link>
			</div>

			<div></div>
		</nav>
	);
}
