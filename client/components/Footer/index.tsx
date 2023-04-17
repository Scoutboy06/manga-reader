import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.links}>
				<Link href='/'>Home</Link>
				<Link href='/contact'>Contact</Link>
				<Link href='/about'>About</Link>
			</div>

			<div className={styles.bottom}>
				<span>&copy; 2023 Manga Reader</span>
				<span>
					We do not store any files on our server, we only link to media which
					is hosted on 3rd party services.
				</span>
			</div>
		</footer>
	);
}
