import { useState, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

import Dropdown from '../../Dropdown';
import BlurContainer from '../../BlurContainer';

import { ProfileContext } from '../../../contexts/ProfileContext';

import styles from './LibraryNavbar.module.css';

export default function LibraryNavbar({ className }) {
	const navigate = useNavigate();
	const [profileData, profileActions] = useContext(ProfileContext);

	const [showProfileDropdown, setShowProfileDropdown] = useState(false);

	return (
		<nav className={styles.navbar}>
			<BlurContainer
				className={styles.profileDropdown}
				onClick={() => setShowProfileDropdown(bool => !bool)}
				onBlur={() => setShowProfileDropdown(false)}
			>
				<img src={profileData.currentProfile.imageUrl} alt='Profile' />
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					style={{ transform: `rotate(${showProfileDropdown * 180}deg)` }}
				>
					<path d='M24 24H0V0h24v24z' fill='none' opacity='.87' />
					<path d='M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z' />
				</svg>

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
							icon: (
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<path d='M10.67,13.02C10.45,13.01,10.23,13,10,13c-2.42,0-4.68,0.67-6.61,1.82C2.51,15.34,2,16.32,2,17.35V19c0,0.55,0.45,1,1,1 h8.26C10.47,18.87,10,17.49,10,16C10,14.93,10.25,13.93,10.67,13.02z' />
									<circle cx='10' cy='8' r='4' />
									<path d='M20.75,16c0-0.22-0.03-0.42-0.06-0.63l0.84-0.73c0.18-0.16,0.22-0.42,0.1-0.63l-0.59-1.02c-0.12-0.21-0.37-0.3-0.59-0.22 l-1.06,0.36c-0.32-0.27-0.68-0.48-1.08-0.63l-0.22-1.09c-0.05-0.23-0.25-0.4-0.49-0.4h-1.18c-0.24,0-0.44,0.17-0.49,0.4 l-0.22,1.09c-0.4,0.15-0.76,0.36-1.08,0.63l-1.06-0.36c-0.23-0.08-0.47,0.02-0.59,0.22l-0.59,1.02c-0.12,0.21-0.08,0.47,0.1,0.63 l0.84,0.73c-0.03,0.21-0.06,0.41-0.06,0.63s0.03,0.42,0.06,0.63l-0.84,0.73c-0.18,0.16-0.22,0.42-0.1,0.63l0.59,1.02 c0.12,0.21,0.37,0.3,0.59,0.22l1.06-0.36c0.32,0.27,0.68,0.48,1.08,0.63l0.22,1.09c0.05,0.23,0.25,0.4,0.49,0.4h1.18 c0.24,0,0.44-0.17,0.49-0.4l0.22-1.09c0.4-0.15,0.76-0.36,1.08-0.63l1.06,0.36c0.23,0.08,0.47-0.02,0.59-0.22l0.59-1.02 c0.12-0.21,0.08-0.47-0.1-0.63l-0.84-0.73C20.72,16.42,20.75,16.22,20.75,16z M17,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S18.1,18,17,18z' />
								</svg>
							),
						},
						{
							content: 'Exit profile',
							action: () => profileActions.deselectProfile(),
							icon: (
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<path d='M0 0h24v24H0V0z' fill='none' />
									<path d='M10.79 16.29c.39.39 1.02.39 1.41 0l3.59-3.59c.39-.39.39-1.02 0-1.41L12.2 7.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L12.67 11H4c-.55 0-1 .45-1 1s.45 1 1 1h8.67l-1.88 1.88c-.39.39-.38 1.03 0 1.41zM19 3H5c-1.11 0-2 .9-2 2v3c0 .55.45 1 1 1s1-.45 1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z' />
								</svg>
							),
						},
						'divider',
						{
							content: 'App settings',
							action: () => navigate('/settings/application'),
							icon: (
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<rect fill='none' height='24' width='24' />
									<path d='M19.5,12c0-0.23-0.01-0.45-0.03-0.68l1.86-1.41c0.4-0.3,0.51-0.86,0.26-1.3l-1.87-3.23c-0.25-0.44-0.79-0.62-1.25-0.42 l-2.15,0.91c-0.37-0.26-0.76-0.49-1.17-0.68l-0.29-2.31C14.8,2.38,14.37,2,13.87,2h-3.73C9.63,2,9.2,2.38,9.14,2.88L8.85,5.19 c-0.41,0.19-0.8,0.42-1.17,0.68L5.53,4.96c-0.46-0.2-1-0.02-1.25,0.42L2.41,8.62c-0.25,0.44-0.14,0.99,0.26,1.3l1.86,1.41 C4.51,11.55,4.5,11.77,4.5,12s0.01,0.45,0.03,0.68l-1.86,1.41c-0.4,0.3-0.51,0.86-0.26,1.3l1.87,3.23c0.25,0.44,0.79,0.62,1.25,0.42 l2.15-0.91c0.37,0.26,0.76,0.49,1.17,0.68l0.29,2.31C9.2,21.62,9.63,22,10.13,22h3.73c0.5,0,0.93-0.38,0.99-0.88l0.29-2.31 c0.41-0.19,0.8-0.42,1.17-0.68l2.15,0.91c0.46,0.2,1,0.02,1.25-0.42l1.87-3.23c0.25-0.44,0.14-0.99-0.26-1.3l-1.86-1.41 C19.49,12.45,19.5,12.23,19.5,12z M12.04,15.5c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S13.97,15.5,12.04,15.5z' />
								</svg>
							),
						},
					]}
					pos={{ x: 0, y: 35 }}
					isShown={showProfileDropdown}
				/>
			</BlurContainer>

			<div className={`${styles.navlinks} ${className || ''}`}>
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
		</nav>
	);
}
