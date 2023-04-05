import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import fetchAPI from '@/functions/fetchAPI.js';
import { useSession, signIn, signOut } from 'next-auth/react';

import Dropdown from '@/components/Dropdown';
import Navlink from '@/components/Navlink';

import styles from './LibraryNavbar.module.css';
import LoginPopup from './../../Popups/LoginPopup';

export default function LibraryNavbar() {
	const router = useRouter();
	const { data: session } = useSession();
	const [searchValue, setSearchValue] = useState('');
	const searchTimeout = useRef();
	const [searchResults, setSearchResults] = useState(null);

	const [showLogin, setShowLogin] = useState(false);

	const searchSubmit = e => {
		e.preventDefault();
		router.push(`/mangas/search?query=${searchValue}`);
	};

	const inputChange = e => {
		setSearchValue(e.target.value);
		clearTimeout(searchTimeout.current);

		if (!e.target.value) {
			setSearchResults(null);
			return;
		}

		searchTimeout.current = setTimeout(async () => {
			const mangas = await fetchAPI(
				'/mangas?' +
					new URLSearchParams({
						limit: 5,
						query: searchValue,
					})
			);

			setSearchResults(mangas);
		}, 500);
	};

	console.log(session);

	return (
		<>
			<nav className={styles.navbar}>
				<div className={styles.left}>
					<button className={`${styles.hamburger} ${styles.button} icon`}>
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

					<div style={{ marginLeft: '1rem' }}>
						<Navlink href='/mangas' className={styles.navlink}>
							Mangas
						</Navlink>
						<Navlink href='/novels' className={styles.navlink}>
							Novels
						</Navlink>
						<Navlink href='/animes' className={styles.navlink}>
							Animes
						</Navlink>
					</div>
				</div>

				<div className={styles.right}>
					<button className={`${styles.button} ${styles.searchBtn} icon`}>
						search
					</button>

					<form className={styles.searchContainer} onSubmit={searchSubmit}>
						<input
							type='text'
							name='mangaSearch'
							value={searchValue}
							onChange={inputChange}
							placeholder='Search...'
							autoComplete='false'
						/>

						<i className='icon'>search</i>

						{searchResults && (
							<Dropdown.Items className={styles.searchResults}>
								{searchResults.map(manga => (
									<Dropdown.Item
										href={`/mangas/${manga.urlName}`}
										className={styles.searchResult}
										key={manga._id}
										aria-label={manga.title}
									>
										<Image
											width={40}
											height={60}
											src={manga.poster}
											alt={manga.title}
										/>

										<div className={styles.content}>
											<h5>{manga.title}</h5>
											<p>{manga.released}</p>
										</div>
									</Dropdown.Item>
								))}

								{searchResults?.length === 0 && (
									<p style={{ textAlign: 'center' }}>No results found</p>
								)}

								{searchResults?.length >= 5 && (
									<button
										onClick={() => {
											router.push(`/mangas/search?query=${searchValue}`);
										}}
										className={styles.allResults + ' btn btn-primary'}
										type='button'
										aria-label='See all results'
									>
										See all results
										<i className='icon'>keyboard_arrow_right</i>
									</button>
								)}
							</Dropdown.Items>
						)}
					</form>

					{session ? (
						<>
							<Dropdown>
								<Dropdown.Button className={'icon outlined ' + styles.button}>
									notifications
								</Dropdown.Button>
							</Dropdown>
							<Dropdown>
								<Dropdown.Button className={styles.button}>
									<Image
										src={session.user.image}
										width={28}
										height={28}
										alt='Profile picture'
									/>
								</Dropdown.Button>

								<Dropdown.Items placement='br'>
									<Dropdown.Item
										href='/profile'
										icon='account_circle'
										iconOutlined
									>
										Profile
									</Dropdown.Item>
									<hr />
									<Dropdown.Item href='/settings' icon='settings'>
										Settings
									</Dropdown.Item>
									<Dropdown.Item onClick={signOut} icon='logout'>
										Log out
									</Dropdown.Item>
								</Dropdown.Items>
							</Dropdown>
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
							<button type='button' className='btn btn-sm btn-primary'>
								Sign up
							</button>
						</>
					)}
				</div>
			</nav>

			<LoginPopup visible={showLogin} close={() => setShowLogin(false)} />
		</>
	);
}
