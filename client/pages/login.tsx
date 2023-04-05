import Head from 'next/head';
import Image from 'next/image';
import { signIn, getSession } from 'next-auth/react';

import styles from '@/styles/login.module.css';

export default function Login() {
	return (
		<>
			<Head>
				<title>Log in - Manga Reader</title>
			</Head>

			<main className={styles.main}>
				<div className={styles.container}>
					<h1>Log in</h1>

					<button
						className='btn btn-secondary'
						type='button'
						onClick={() => signIn('google')}
						style={{ backgroundColor: 'rgb(234 67 53 / 35%)' }}
					>
						<div className={styles.icon + ' icon'}>
							<Image
								src='/icons/google.svg'
								width={24}
								height={24}
								alt='Google logo'
							/>
						</div>
						Continue with Google
					</button>

					<button
						className='btn btn-secondary'
						type='button'
						onClick={() => signIn('email')}
					>
						<div className={styles.icon + ' icon'}>email</div>
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
					</form> */}
				</div>
			</main>
		</>
	);
}

export async function getServerSideProps(context) {
	const { req } = context;
	const session = await getSession({ req });

	if (session) {
		return {
			redirect: { destination: '/' },
		};
	}

	return {
		props: {},
	};
}
