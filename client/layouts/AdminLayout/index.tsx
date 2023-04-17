import AdminNavbar from '@/components/navbars/AdminNavbar';
import styles from './AdminLayout.module.css';
import { ReactElement } from 'react';

interface Props {
	children?: ReactElement | string;
	top?: ReactElement | string;
}

export default function AdminLayout({ children, top }: Props) {
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
