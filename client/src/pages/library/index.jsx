import { useState, useContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import Dropdown from '../../components/Dropdown';
import BlurContainer from '../../components/BlurContainer';
import Navbar from '../../components/navbars/Library';

import { ProfileContext } from '../../contexts/ProfileContext';

import styles from './index.module.css';

export default function Library() {
	const navigate = useNavigate();
	const [profileData, profileActions] = useContext(ProfileContext);

	const [showProfileDropdown, setShowProfileDropdown] = useState(false);

	return (
		<>
			<main className={styles.main}>
				<Navbar />
				<Outlet />
			</main>
		</>
	);
}
