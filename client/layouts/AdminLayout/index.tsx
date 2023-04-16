import AdminNavbar from '@/components/navbars/AdminNavbar';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children, top }) {
	return (
		<div className={styles.pageContainer}>
			<AdminNavbar />

			<main className={styles.main}>
				{top && <div className={styles.top}>{top}</div>}
				{children}
			</main>
		</div>
	);
}
