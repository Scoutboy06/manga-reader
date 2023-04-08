import Head from 'next/head';
import styles from './mangas.module.css';
import adminServerSideProps from '@/lib/adminServerSideProps';
import AdminLayout from '@/components/layouts/AdminLayout';
import Link from 'next/link';

export default function Mangas() {
	return (
		<>
			<Head>
				<title>Settings - Mangas</title>
			</Head>

			<AdminLayout>
				<div className={styles.top}>
					<h1>Mangas</h1>
					<Link href='/admin/mangas/new' className='btn btn-primary icon-left'>
						<i className='icon'>add</i>
						Create new
					</Link>
				</div>

				<div className={styles.infoCards}>
					<div className={styles.infoCard}>
						<h1>13</h1>
						<p>Total mangas</p>
					</div>
					<div className={styles.infoCard}>
						<h1>10</h1>
						<p>Ongonig mangas</p>
					</div>
					<div className={styles.infoCard}>
						<h1>3</h1>
						<p>Finished mangas</p>
					</div>
					<div className={styles.infoCard}>
						<h1>1039</h1>
						<p>Total chapters</p>
					</div>
				</div>
			</AdminLayout>
		</>
	);
}

export const getServerSideProps = adminServerSideProps;
