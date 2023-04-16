import styles from './DefaultLayout.module.css';
import Navbar from '@/components/navbars/DefaultNavbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

export default function DefaultLayout({ children }) {
	return (
		<>
			<Navbar />
			<div className={styles.container}>{children}</div>
			<Footer />
			<CookieConsent />
		</>
	);
}
