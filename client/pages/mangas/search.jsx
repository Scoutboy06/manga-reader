import { useState, useRef } from 'react';
import Head from 'next/head';

import fetchAPI from '@/functions/fetchAPI';

import Navbar from '@/components/navbars/SearchNavbar';

import styles from '@/styles/search.module.css';

export default function Search() {
	const [searchVal, setSearchVal] = useState('');
	const [searchItems, setSearchItems] = useState([]);

	const input = useRef();
	const searchTimeout = useRef();

	const updateInput = val => {
		setSearchVal(val);
		clearTimeout(searchTimeout.current);

		searchTimeout.current = setTimeout(async () => {
			const res = await fetchAPI(
				'/search?' +
					new URLSearchParams({
						type: 'manga',
						query: val,
					})
			);

			setSearchItems(res);
		}, 500);
	};

	return (
		<>
			<Head>
				<title>Search</title>
			</Head>

			<Navbar />

			<div className={styles.searchContainer}>
				<div className={styles.inputContainer}>
					<input
						type='text'
						placeholder='Search'
						value={searchVal}
						onChange={e => updateInput(e.target.value)}
						autoCapitalize='off'
						autoCorrect='off'
						className={styles.input}
						ref={input}
						autoFocus={true}
					/>

					<button
						type='reset'
						className={`${styles.resetBtn} icon ${
							searchVal.length === 0 ? 'hidden' : ''
						}`}
						onClick={() => updateInput('')}
					>
						close
					</button>

					<button className={styles.searchIcon + ' icon'} type='submit'>
						search
					</button>
				</div>

				<div className={styles.items}>
					{searchItems.map((item, i) => (
						<div className={styles.item} key={`item_${i}`}></div>
					))}
				</div>
			</div>
		</>
	);
}
