import styles from './VerticalNavbar.module.css';
import Link from 'next/link';

interface Props {
	visible: boolean;
	close: () => void;
}

export default function VerticalNavbar({ visible, close }: Props) {
	return (
		<>
			<div
				className={styles.background + (visible ? ' visible' : '')}
				onClick={close}
			></div>
			<nav className={styles.navbar + (visible ? ' visible' : '')}>
				<Link href='/mangas' className={styles.link}>
					Home
				</Link>
				<Link href='/mangas/popular' className={styles.link}>
					Popular
				</Link>
				<Link href='/mangas/newest' className={styles.link}>
					Newest
				</Link>
				<Link href='/mangas/updated' className={styles.link}>
					Updated
				</Link>
				<Link href='/mangas/top-100' className={styles.link}>
					Top 100
				</Link>
				<Link href='/mangas/random' className={styles.link}>
					Random
				</Link>
			</nav>
		</>
	);
}
