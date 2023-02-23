import { useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';

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
				<DropdownButton
					className={styles.profileDropdown}
					dropdownItems={[
						...(profiles || [])?.map(profile => ({
							content: profile.name,
							icon: <img src={profile.imageUrl} alt='Profile' />,
							action: () => selectProfile(profile),
						})),
						'divider',
						{
							content: 'Profile settings',
							action: () => router.push(`/settings/profile`),
							icon: <i className='icon'>manage_accounts</i>,
						},
						{
							content: 'Exit profile',
							action: () => {
								deselectProfile();
								router.push('/');
							},
							icon: <i className='icon'>logout</i>,
						},
						'divider',
						{
							content: 'Settings',
							action: () => router.push('/settings'),
							icon: <i className='icon'>settings</i>,
						},
					]}
					offset={{ x: 0, y: 5 }}
				>
					<img src={currentProfile?.profilePicture} alt='Profile' />
					<i className='icon'>chevron_left</i>
				</DropdownButton>
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

			<div>
				<button
					className={styles.searchBtn + ' icon'}
					onClick={() => router.push('/mangas/search')}
				>
					search
				</button>
			</div>
		</nav>
	);
}
