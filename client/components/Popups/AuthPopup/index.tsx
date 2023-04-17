import Image from 'next/image';
import { signIn } from 'next-auth/react';

import Popup from '@/components/Popup';

import styles from './LoginPopup.module.css';

export default function AuthPopup({ title, ...props }) {
	const icons = {
		google: (
			<Image src='/icons/google.svg' width={24} height={24} alt='Google logo' />
		),
		email: 'email',
	};

	return (
		<Popup {...props} unmountOnClose={false}>
			<div className={styles.container}>
				<h1>{title}</h1>

				<button
					className={'btn btn-secondary ' + styles.googleBtn}
					type='button'
					onClick={() => signIn('google')}
				>
					<div className={styles.icon + ' icon'}>{icons.google}</div>
					Continue with Google
				</button>

				{/* <button
					className='btn btn-secondary'
					type='button'
					onClick={() => signIn('email')}
					disabled
				>
					<div className={styles.icon + ' icon'}>{icons.email}</div>
					Continue with Email
				</button> */}
			</div>
		</Popup>
	);
}
