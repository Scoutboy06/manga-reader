import type { ReactNode } from 'react';
// import styles from './DefaultLayout.module.css';
import Navbar from '@/components/navbars/DefaultNavbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
// import { Poppins } from 'next/font/google';

// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['500', '400', '300'],
//   variable: '--font-poppins',
//   display: 'swap',
// });

interface Props {
  children?: ReactNode | string;
}

export default function DefaultLayout({ children }: Props) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
      <CookieConsent />
    </div>
  );
}
