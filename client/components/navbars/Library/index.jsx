import { useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import fetchAPI from '@/functions/fetchAPI.js';

import DropdownButton from '@/components/DropdownButton';
import Navlink from '@/components/Navlink';

import { useProfile } from '@/contexts/ProfileContext';

import styles from './LibraryNavbar.module.css';

export default function LibraryNavbar() {
	const router = useRouter();
	const [_, { deselectProfile }] = useProfile();
	const [searchValue, setSearchValue] = useState('');
	const searchTimeout = useRef();
	const [searchResults, setSearchResults] = useState(null);

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

	return (
		<nav className={styles.navbar}>
			<div>
				<Link href='/' className={styles.logo}>
					<Image
						src='/appIcons/rikka_square_72.png'
						width={40}
						height={40}
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
				<form
					className={styles.searchContainer}
					onSubmit={searchSubmit}
					onBlur={() => setSearchResults(null)}
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

					<div
						className={
							styles.searchResults + (searchResults !== null ? ' visible' : '')
						}
					>
						{searchResults?.map(manga => (
							<Link
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
									<p></p>
								</div>
							</Link>
						))}

						{searchResults?.length === 0 && (
							<p style={{ textAlign: 'center' }}>No results found</p>
						)}

						{searchResults?.length >= 5 && (
							<button
								type='button'
								onClick={() =>
									router.push(`/mangas/search?query=${searchValue}`)
								}
								aria-label='See all results'
								className={styles.allResults}
							>
								See all results
							</button>
						)}
					</div>
				</form>

				<button className={styles.button} type='button'>
					<i className='icon outlined'>notifications</i>
				</button>

				<DropdownButton
					className={[styles.profileDropdown, styles.button].join(' ')}
					dropdownItems={[
						{
							content: 'Profile',
							icon: <i className='icon outlined'>account_circle</i>,
							action: () => router.push(`/profile`),
						},
						'divider',
						{
							content: 'Settings',
							action: () => router.push('/settings'),
							icon: <i className='icon'>settings</i>,
						},
						{
							content: 'Sign out',
							action: () => {
								deselectProfile();
								router.push('/');
							},
							icon: <i className='icon'>logout</i>,
						},
					]}
					offset={{ x: 0, y: 5 }}
				>
					<i className='icon outlined'>account_circle</i>
				</DropdownButton>
			</div>
		</nav>
	);
}
