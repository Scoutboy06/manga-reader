import Image from 'next/image';
import { useForm } from 'react-hook-form';

import Popup from '@/components/Popup';

import styles from '@/styles/LoginPopup.module.css';

export default function LoginPopup(props) {
	const { register, handleSubmit, formState } = useForm();

	const submitHandler = () => {
		console.log(formState);
	};

	return (
		<Popup {...props} unmountOnClose={false}>
			<div className={styles.container}>
				<div>
					<h1>Log in</h1>
					<p></p>
				</div>

				<button className='btn btn-secondary' type='button'>
					<Image
						src='/icons/google.svg'
						alt='Google logo'
						height={24}
						width={24}
						style={{ marginRight: '1rem' }}
					/>
					Sign in with Google
				</button>

				{/* <div
					id='g_id_onload'
					data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
					data-context='signin'
					data-ux_mode='popup'
					// data-callback='console.log'
					data-auto_prompt='false'
				></div>

				<div
					className='g_id_signin'
					data-type='standard'
					data-shape='pill'
					data-theme='filled_blue'
					data-text='signin_with'
					data-size='large'
					data-locale='en-US'
					data-logo_alignment='left'
				></div> */}

				<div className={styles.divider}>
					<div></div>
					<p>Or</p>
					<div></div>
				</div>

				<form className='formGroup' onSubmit={handleSubmit(submitHandler)}>
					<label htmlFor='email'>Email or Username</label>
					<input
						{...register('email', { required: true })}
						type='text'
						autoComplete='email'
						name='email'
						id='email'
					/>

					<label htmlFor='password'>Password</label>
					<input
						{...register('password', { required: true })}
						type='password'
						autoComplete='password'
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
				</p>
			</div>
		</Popup>
	);
}
