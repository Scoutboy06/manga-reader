import { useEffect, useState } from 'react';
import styles from './CookieConsent.module.css';

export default function CookieConsent() {
	const [hasConsented, setHasConsented] = useState(true);

	const consent = () => {
		setHasConsented(true);
		localStorage.setItem('acceptedCookies', 'true');
	};

	useEffect(() => {
		if (localStorage.getItem('acceptedCookies') !== 'true')
			setHasConsented(false);
	}, []);

	return (
		<div className={styles.banner + (hasConsented ? ' hidden' : '')}>
			<p>We use necessary cookies to make our site work.</p>
			<button className='btn btn-primary' onClick={consent}>
				Accept
			</button>
		</div>
	);
}
