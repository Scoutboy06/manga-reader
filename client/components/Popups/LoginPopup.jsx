import Image from 'next/image';
import { signIn } from 'next-auth/react';

import Popup from '@/components/Popup';

import styles from '@/styles/LoginPopup.module.css';

export default function LoginPopup(props) {
	const icons = {
		google: (
			<Image src='/icons/google.svg' width={24} height={24} alt='Google logo' />
		),
		email: 'email',
	};

	return (
		<Popup {...props} unmountOnClose={false}>
			<div className={styles.container}>
				<h1>Log in</h1>

				<button
					className={'btn btn-secondary ' + styles.googleBtn}
					type='button'
					onClick={() => signIn('google')}
				>
					<div className={styles.icon + ' icon'}>{icons.google}</div>
					Continue with Google
				</button>

				<button
					className='btn btn-secondary'
					type='button'
					onClick={() => signIn('email')}
					disabled
				>
					<div className={styles.icon + ' icon'}>{icons.email}</div>
					Continue with Email
				</button>

				{/* <div className={styles.divider}>
					<div></div>
					<p>Or</p>
					<div></div>
				</div>

				<form className='formGroup' onSubmit={handleSubmit(submitHandler)}>
					<label htmlFor='email'>Email or Username</label>
					<input
						{...register('email', { required: true })}
						type='text'
						name='email'
						id='email'
					/>

					<label htmlFor='password'>Password</label>
					<input
						{...register('password', { required: true })}
						type='password'
						name='password'
						id='password'
					/>

					<button
						className={'btn btn-primary btn-lg ' + styles.submit}
						type='submit'
					>
						Log in
					</button>
				</form>

				<p>
					Don't have an account?{' '}
					<button
						className='btn'
						style={{
							display: 'inline',
							padding: 0,
							fontWeight: 'bold',
							borderRadius: 0,
						}}
					>
						Sign up
					</button>
				</p> */}
			</div>
		</Popup>
	);
}
