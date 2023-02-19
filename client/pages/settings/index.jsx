import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import Navbar from '../../components/navbars/Settings';

import styles from './settings.module.css';

export default function Settings() {
	return (
		<>
			<Navbar />

			<main className={styles.main}>
				<Outlet />
			</main>
		</>
	);
}
