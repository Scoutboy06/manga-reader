import Head from 'next/head';
import Link from 'next/link';

import Navbar from '@/components/navbars/Settings';

import styles from '@/styles/settings.module.css';

export default function Mangas() {
	return (
		<>
			<Head>
				<title>Settings - Mangas</title>
			</Head>

			<Navbar />

			<main className={styles.main}>
				<h1>Mangas</h1>

				<Link href='/settings/mangas/new'>Create a new manga</Link>
			</main>
		</>
	);
}
