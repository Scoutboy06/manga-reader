import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import styles from './DefaultNavbar.module.css';
import AuthPopup from '@/components/Popups/AuthPopup';
import VerticalNavbar from '@/components/navbars/VerticalNavbar';
import useSWRImmutable from 'swr/immutable';
import Notification from '@/types/Notification';
import NotificationButton from '@/components/NotificationsButton';
import ProfileButton from '@/components/ProfileButton';
import SearchBar from '@/components/SearchBar';

export default function DefaultNavbar() {
	const { data: session } = useSession();

	const [showLogin, setShowLogin] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);
	const [showVertical, setShowVertical] = useState(false);

	return (
		<>
			<VerticalNavbar
				visible={showVertical}
				close={() => setShowVertical(false)}
			/>

			<nav
				className={styles.navbar}
				aria-label='site navigation'
				role='navigation'
			>
				<div className={styles.left}>
					<button
						className={`${styles.hamburger} ${styles.button} icon`}
						onClick={() => setShowVertical(!showVertical)}
					>
						menu
					</button>

					<Link href='/'>
						<Image
							src='/appIcons/rikka_square_72.png'
							width={32}
							height={32}
							alt='Logo'
						/>
					</Link>

					<div className={styles.navlinks}>
						<Link href='/mangas/popular'>Popular</Link>
						<Link href='/mangas/newest'>Newest</Link>
						<Link href='/mangas/updated'>Updated</Link>
						<Link href='/mangas/top-100'>Top 100</Link>
						<Link href='/mangas/random'>Random</Link>
					</div>
				</div>

				<div className={styles.right}>
					<SearchBar />

					{session?.user ? (
						<>
							<NotificationButton />
							<ProfileButton session={session} />
						</>
					) : (
						<>
							<button
								type='button'
								className='btn btn-sm'
								onClick={() => setShowLogin(true)}
							>
								Log in
							</button>
							<button
								type='button'
								className='btn btn-sm btn-primary'
								onClick={() => setShowSignUp(true)}
							>
								Sign up
							</button>
						</>
					)}
				</div>
			</nav>

			{!session?.user && (
				<>
					<AuthPopup
						title='Log in'
						visible={showLogin}
						close={() => setShowLogin(false)}
					/>

					<AuthPopup
						title='Sign up'
						visible={showSignUp}
						close={() => setShowSignUp(false)}
					/>
				</>
			)}
		</>
	);
}
