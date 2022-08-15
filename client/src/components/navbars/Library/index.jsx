import { useState, useContext } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';

import Dropdown from '../../Dropdown';
import BlurContainer from '../../BlurContainer';

import { ProfileContext } from '../../../contexts/ProfileContext';

import styles from './LibraryNavbar.module.css';

export default function LibraryNavbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const [profileData, profileActions] = useContext(ProfileContext);

	const [showProfileDropdown, setShowProfileDropdown] = useState(false);

	return (
		<nav className={styles.navbar}>
			<div>
				<BlurContainer
					className={styles.profileDropdown}
					onClick={() => setShowProfileDropdown(bool => !bool)}
					onBlur={() => setShowProfileDropdown(false)}
				>
					<img src={profileData.currentProfile.imageUrl} alt='Profile' />
					<i
						className='icon'
						style={{
							transform: `rotate(${(showProfileDropdown * 2 - 1) * 90}deg)`,
						}}
					>
						chevron_left
					</i>

					<Dropdown
						items={[
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
								action: () => profileActions.deselectProfile(),
								icon: <i className='icon'>logout</i>,
							},
							'divider',
							{
								content: 'App settings',
								action: () => navigate('/settings/application'),
								icon: <i className='icon'>settings</i>,
							},
						]}
						pos={{ x: 0, y: 35 }}
						isShown={showProfileDropdown}
					/>
				</BlurContainer>
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
				{location.pathname === '/animes' && (
					<button className={styles.button}>
						<i className='icon'>search</i>
					</button>
				)}
			</div>
		</nav>
	);
}
