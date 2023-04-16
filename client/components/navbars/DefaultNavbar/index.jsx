import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import Dropdown from '@/components/Dropdown';
import styles from './DefaultNavbar.module.css';
import LoginPopup from '@/components/popups/LoginPopup';
import VerticalNavbar from '@/components/navbars/VerticalNavbar';

export default function LibraryNavbar() {
	const router = useRouter();
	const { data: session } = useSession();
	const [searchValue, setSearchValue] = useState('');
	const [searchResults, setSearchResults] = useState(null);
	const [showLogin, setShowLogin] = useState(false);
	const [showVertical, setShowVertical] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const searchTimeout = useRef();
	const searchContainer = useRef(null);
	const searchBtn = useRef(null);

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
			const mangas = await axios.get('/api/mangas', {
				params: {
					limit: 5,
					query: e.target.value,
				},
			});

			if (!mangas.data) {
				console.error(mangas);
				return;
			}

			setSearchResults(mangas.data);
		}, 200);
	};

	useEffect(() => {
		const click = e => {
			const path = e.composedPath();

			if (
				searchContainer.current &&
				!path.includes(searchContainer.current) &&
				!path.includes(searchBtn.current)
			) {
				setSearchResults(null);
				setShowSearch(false);
			}
		};

		window.addEventListener('click', click);

		return () => {
			window.removeEventListener('click', click);
		};
	}, []);

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

					<Link href='/mangas'>
						<Image
							src='/appIcons/rikka_square_72.png'
							width={32}
							height={32}
							alt='Logo'
						/>
					</Link>

					<div style={{ marginLeft: '1rem' }}>
						<Link href='/mangas/popular' className={styles.navlink}>
							Popular
						</Link>
						<Link href='/mangas/newest' className={styles.navlink}>
							Newest
						</Link>
						<Link href='/mangas/updated' className={styles.navlink}>
							Updated
						</Link>
						<Link href='/mangas/top-100' className={styles.navlink}>
							Top 100
						</Link>
						<Link href='/mangas/random' className={styles.navlink}>
							Random
						</Link>
					</div>
				</div>

				<div className={styles.right}>
					<button
						className={`${styles.button} ${styles.searchBtn} icon`}
						onClick={() => setShowSearch(!showSearch)}
						ref={searchBtn}
					>
						search
					</button>

					<form
						className={styles.searchContainer + (showSearch ? ' visible' : '')}
						onSubmit={searchSubmit}
						ref={searchContainer}
					>
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
							<Dropdown.Items placement='bl' style={{ width: '100%' }}>
								{searchResults?.map(manga => (
									<Dropdown.Item
										href={`/mangas/${manga.urlName}`}
										className={styles.searchResult}
										key={manga._id}
										aria-label={manga.title}
										onClick={() => {
											setSearchResults(null);
											setShowSearch(false);
										}}
									>
										<Image
											width={40}
											height={60}
											src={manga.poster}
											alt={manga.title}
										/>

										<div className={styles.content}>
											<h5>{manga.title}</h5>
											<p>
												{manga.released ? manga.released + ' • ' : ''}
												<span style={{ textTransform: 'capitalize' }}>
													{manga.airStatus}
												</span>
											</p>
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
										src={session?.user?.image}
										width={28}
										height={28}
										alt='Profile picture'
									/>
								</Dropdown.Button>

								<Dropdown.Items placement='br'>
									{session?.user?.isAdmin && (
										<Dropdown.Item href='/admin' icon='dashboard'>
											Admin
										</Dropdown.Item>
									)}
									<Dropdown.Item href='/profile' icon='person'>
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
