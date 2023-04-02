import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

import Popup from '@/components/Popup';

import styles from '@/styles/LoginPopup.module.css';

export default function LoginPopup(props) {
	const btnContainer = useRef();
	const { register, handleSubmit, formState } = useForm();

	const submitHandler = () => {
		console.log(formState);
	};

	useEffect(() => {
		if (!window.google) return;

		window.google.accounts.id.renderButton(btnContainer.current, {
			type: 'standard',
			width: 384,
			theme: 'filled_blue',
			// theme: 'filled_black',
			// theme: 'filled_white',
			size: 'large',
			text: 'signin_with',
			shape: 'pill',
			locale: 'EN_eng',
			logo_alignment: 'left',
			click_listener: console.log,
		});
	}, []);

	return (
		<Popup {...props} unmountOnClose={false}>
			<div className={styles.container}>
				<h1>Log in</h1>

				<div ref={btnContainer}></div>

				{/* <button
					className='btn btn-secondary'
					type='button'
				>
					<Image
						src='/icons/google.svg'
						alt='Google logo'
						height={24}
						width={24}
						style={{ marginRight: '1rem' }}
					/>
					Sign in with Google
				</button> */}

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
				</p>
			</div>
		</Popup>
	);
}
