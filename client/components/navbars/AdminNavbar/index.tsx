import Link from 'next/link';
import styles from './AdminNavbar.module.css';
import Navlink from '@/components/Navlink';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

export default function AdminNavbar() {
	return (
		<nav className={styles.navbar}>
			<Link href='/' className={styles.logo}>
				<Image
					src='/appIcons/rikka_square_72.png'
					alt='Logo'
					width={48}
					height={48}
				/>
			</Link>

			<div className={styles.buttonContainer}>
				<Navlink href='/admin' className={styles.navlink}>
					<i className='icon'>dashboard</i>
					General
				</Navlink>
				<Navlink href='/admin/users' className={styles.navlink} subpaths>
					<i className='icon'>people</i>
					Users
				</Navlink>
				<Navlink href='/admin/mangas' className={styles.navlink} subpaths>
					<i className='icon'>book</i>
					Mangas
				</Navlink>
				<Navlink href='/admin/hosts' className={styles.navlink} subpaths>
					<i className='icon'>dns</i>
					Hosts
				</Navlink>
			</div>

			<div className={styles.buttonContainer}>
				<button className={'btn ' + styles.navlink} onClick={() => signOut()}>
					<i className='icon'>logout</i>
					Log out
				</button>
			</div>
		</nav>
	);
}
