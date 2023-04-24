import styles from './SearchBar.module.css';
import Dropdown from '@/components/Dropdown';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import IManga from '@/types/Manga';
import axios from 'axios';

export default function SearchBar() {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState('');
	const [searchResults, setSearchResults] = useState<IManga[] | null>(null);
	const [showSearch, setShowSearch] = useState(false);
	const searchTimeout = useRef<number | null>(null);
	const searchBtn = useRef(null);

	const searchSubmit = (e: FormEvent) => {
		e.preventDefault();
		router.push(`/mangas/search?q=${searchValue}`);
	};

	const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target) return;

		setSearchValue(e.target.value);
		if (searchTimeout.current) clearTimeout(searchTimeout.current);

		if (!e.target.value) return setSearchResults(null);

		searchTimeout.current = window.setTimeout(async () => {
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

	return (
		<>
			<button
				className={[styles.button, styles.searchBtn, 'icon'].join(' ')}
				onClick={() => setShowSearch(!showSearch)}
				ref={searchBtn}
			>
				search
			</button>

			<Dropdown
				as='form'
				placement='bl'
				className={styles.searchContainer + (showSearch ? ' visible' : '')}
				onSubmit={searchSubmit}
				isOpen={!!searchResults}
				setIsOpen={() => setSearchResults(null)}
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
					<Dropdown.Menu style={{ width: '100%' }}>
						{searchResults?.map(manga => (
							<Dropdown.Item
								href={`/mangas/${manga.urlName}`}
								className={styles.dropdownItem}
								key={manga._id.toString()}
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
					</Dropdown.Menu>
				)}
			</Dropdown>
		</>
	);
}
