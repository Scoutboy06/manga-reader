import { useContext } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';

import DropdownButton from '../../DropdownButton';
import NewMangaPopup from '../../Popups/NewMangaPopup';

import { ProfileContext } from '../../../contexts/ProfileContext';
import { PopupContext } from './../../../contexts/PopupContext';

import styles from './LibraryNavbar.module.css';

export default function LibraryNavbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const [profileData, profileActions] = useContext(ProfileContext);
	const [, popupActions] = useContext(PopupContext);

	return (
		<nav className={styles.navbar}>
			<div>
				<DropdownButton
					className={styles.profileDropdown}
					dropdownItems={[
						...profileData.profiles.map(profile => ({
							content: profile.name,
							icon: <img src={profile.imageUrl} alt='Profile' />,
							action: () => profileActions.selectProfile(profile),
						})),
						'divider',
						{
							content: 'Profiles settings',
							action: () => navigate(`/settings/profiles`),
							icon: <i className='icon'>manage_accounts</i>,
						},
						{
							content: 'Exit profile',
							action: () => {
								profileActions.deselectProfile();
								navigate('/');
							},
							icon: <i className='icon'>logout</i>,
						},
						'divider',
						{
							content: 'App settings',
							action: () => navigate('/settings/application'),
							icon: <i className='icon'>settings</i>,
						},
					]}
					offset={{ x: 0, y: 5 }}
				>
					<img src={profileData.currentProfile.imageUrl} alt='Profile' />
					<i className='icon'>chevron_left</i>
				</DropdownButton>
			</div>

			<div>
				<NavLink to='/mangas' className={styles.navlink}>
					Mangas
				</NavLink>
				<NavLink to='/novels' className={styles.navlink}>
					Novels
				</NavLink>
				<NavLink to='/animes' className={styles.navlink}>
					Animes
				</NavLink>
			</div>

			<div>
				<button
					className={styles.button}
					onClick={() => {
						popupActions.createPopup({
							title: 'Search for a new manga',
							content:
								location.pathname === '/mangas' ? (
									NewMangaPopup
								) : (
									<h1>Hello</h1>
								),
						});
					}}
				>
					<i className='icon'>search</i>
				</button>
			</div>
		</nav>
	);
}
