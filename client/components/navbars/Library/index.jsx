import { useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import DropdownButton from '@/components/DropdownButton';
import NewMangaPopup from '@/components/Popups/NewMangaPopup';
import Navlink from '@/components/Navlink';

import { useProfile } from '@/contexts/ProfileContext';

import styles from './LibraryNavbar.module.css';

export default function LibraryNavbar() {
	const router = useRouter();
	const [{ profiles, currentProfile }, { selectProfile, deselectProfile }] =
		useProfile();

	return (
		<nav className={styles.navbar}>
			<div>
				<Link href='/' className={styles.logo}>
					<Image
						src='/appIcons/rikka_square_72.png'
						width={40}
						height={40}
						alt='Logo'
					/>
				</Link>
			</div>

			<div>
				<Navlink href='/mangas' className={styles.navlink}>
					Mangas
				</Navlink>
				<Navlink href='/novels' className={styles.navlink}>
					Novels
				</Navlink>
				<Navlink href='/animes' className={styles.navlink}>
					Animes
				</Navlink>
			</div>

			<div style={{ justifyContent: 'flex-end' }}>
				{/* <button
					className={styles.searchBtn + ' icon'}
					onClick={() => router.push('/mangas/search')}
				>
					search
				</button> */}

				<i className='icon outlined'>notifications</i>

				<DropdownButton
					className={styles.profileDropdown}
					dropdownItems={[
						{
							content: 'Profile',
							icon: <i className='icon outlined'>account_circle</i>,
							action: () => router.push(`/profile`),
						},
						'divider',
						{
							content: 'Settings',
							action: () => router.push('/settings'),
							icon: <i className='icon'>settings</i>,
						},
						{
							content: 'Sign out',
							action: () => {
								deselectProfile();
								router.push('/');
							},
							icon: <i className='icon'>logout</i>,
						},
					]}
					offset={{ x: 0, y: 5 }}
				>
					<i className='icon outlined'>account_circle</i>
				</DropdownButton>
			</div>
		</nav>
	);
}
