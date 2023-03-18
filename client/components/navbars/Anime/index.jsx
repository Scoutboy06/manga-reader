import Link from 'next/Link';
import { useRouter } from 'next/router';

import styles from './AnimeNavbar.module.css';

export default function AnimeNavbar() {
	const router = useRouter();
	const path = router.pathname.slice(1).split('/');

	return (
		<nav className={styles.navbar}>
			<div className={styles.buttonContainer}>
				<Link
					href={`/${path.slice(0, path.length - 1).join('/')}`}
					className={styles.button}
				>
					<i className='icon' style={{ fontSize: 28 }}>
						chevron_left
					</i>
				</Link>
				<Link href={`/${path[0]}`} className={styles.button}>
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
