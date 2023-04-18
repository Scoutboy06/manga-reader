import styles from './DefaultLayout.module.css';
import Navbar from '@/components/navbars/DefaultNavbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { ReactNode } from 'react';

interface Props {
	children?: ReactNode | string;
}

export default function DefaultLayout({ children }: Props) {
	return (
		<>
			<Navbar />
			<div className={styles.container}>{children}</div>
			<Footer />
			<CookieConsent />
		</>
	);
}
