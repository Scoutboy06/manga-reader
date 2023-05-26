import styles from './DefaultLayout.module.css';
import Navbar from '@/components/navbars/DefaultNavbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { ReactNode } from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-poppins',
	display: 'swap',
});

interface Props {
	children?: ReactNode | string;
}

export default function DefaultLayout({ children }: Props) {
	return (
		<div className={[poppins.variable, styles.layout].join(' ')}>
			<Navbar />
			<div className={styles.content}>{children}</div>
			<Footer />
			<CookieConsent />
		</div>
	);
}
