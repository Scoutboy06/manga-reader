import { useState } from 'react';

import Loader from '../Loader';

import styles from './index.module.css';

export default function NewMangaOverlay({ visible, setVisibility }) {
	const [inputText, setInputText] = useState('');
	const [hosts, setHosts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	// eslint-disable-next-line
	const [isSubscribed, setIsSubscribed] = useState(false);

	const [selectedData, setSelectedData] = useState(null);
	const [selectedMangaEl, setSelectedMangaEl] = useState(null);

	const formSubmit = e => {
		e.preventDefault();

		setHosts([]);
		setIsLoading(true);

		fetch('api/search/?' + new URLSearchParams({ mangaName: inputText }))
			.then(res => res.json())
			.then(json => {
				console.log(json);
				setIsLoading(false);
				setHosts(json);
			})
			.catch(console.error);
	};

	const selectManga = ({ e, host, hostIndex, manga, mangaIndex }) => {
		setSelectedData({ host, manga });
		if (selectedMangaEl) selectedMangaEl.removeAttribute('selected');

		const path = e.nativeEvent.path.reverse();
		const selectedEl = path[9];

		setSelectedMangaEl(selectedEl);
		selectedEl.setAttribute('selected', true);
	};

	const createNewManga = e => {
		e.target.setAttribute('disabled', true);

		const { manga, host } = selectedData;

		console.log(selectedData);
		// console.log(manga.latestChapter);
		// console.log(manga.latestChapter.match(new RegExp('(chapter)[ -]*([0-9.,]+)', 'i')));

		const payload = {
			name: manga.mangaName,
			urlName: manga.urlName,
			chapter: 'chapter-1',
			// lastChapter: manga.latestChapter.match(new RegExp('(chapter)[ -]*([0-9.,]+)', 'i'))[2],
			subscribed: isSubscribed,
			host: {
				hostName: host.hostName,
				mangaName: manga.urlName,
			},
			coverUrl: manga.imgUrl,
		};

		console.log(payload);
		console.log(JSON.stringify(payload));

		fetch('api/manga', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: { 'Content-Type': 'application/json' },
		})
			.then(res => res.json())
			.then(json => {
				console.log('Manga was sucessfully created!');
				console.log(json);
				alert('Manga was sucessfully created!');
				window.location.reload();
			})
			.catch(console.error);
	};

	return (
		<div className={[styles.overlay, visible ? styles.visible : ''].join(' ')}>
			<header>
				<form onSubmit={formSubmit} className={styles.inputContainer}>
					<input
						type='text'
						placeholder='Search for a manga...'
						value={inputText}
						onChange={e => setInputText(e.target.value)}
						autoCapitalize='off'
						autoCorrect='off'
					/>

					{inputText.length > 0 && (
						<button
							type='reset'
							className={[
								styles.resetBtn,
								inputText.length > 0 ? styles.visible : '',
							].join(' ')}
							onClick={() => setInputText('')}
						>
							<img
								src='icons/add-white-24dp.svg'
								alt='x'
								style={{ transform: 'rotate(45deg)' }}
							/>
						</button>
					)}

					<button type='submit' className={styles.submitBtn}>
						<img src='icons/search-white-24dp.svg' alt='Search' />
					</button>
				</form>
			</header>

			<main style={{ textAlign: 'center' }}>
				{!isLoading &&
					hosts.map((host, hostIndex) => (
						<div key={hostIndex} style={{ textAlign: 'left' }}>
							<div className={styles.hostName}>{host.hostName}</div>

							{host.mangas.map((manga, mangaIndex) => (
								<div
									key={hosts.length + mangaIndex}
									className={styles.mangaItem}
									onClick={e =>
										selectManga({ e, host, hostIndex, manga, mangaIndex })
									}
								>
									<div className={styles.mangaItemImageContainer}>
										<img src={manga.imgUrl} alt='Manga cover' />
									</div>
									<div className={styles.mangaItemDetails}>
										<span className='manganName'>{manga.mangaName}</span>
										<span className='latestChapter'>{manga.latestChapter}</span>
										<span className='latestUpdate'>{manga.latestUpdate}</span>
										{/* <input type="hidden" className="urlName" value={manga.urlName} /> */}
									</div>
								</div>
							))}
						</div>
					))}

				{isLoading && (
					<Loader
						size={60}
						style={{
							position: 'absoulte',
							left: 'calc(50% - 30px)',
							top: '100px',
						}}
					/>
				)}
			</main>

			<footer className={styles.footerContainer}>
				<button
					type='reset'
					onClick={() => {
						setInputText('');
						setHosts([]);
						setSelectedData(null);
						setSelectedMangaEl(null);
						setVisibility(false);
					}}
				>
					Cancel
				</button>
				<button type='submit' disabled={!selectedData} onClick={createNewManga}>
					Select
				</button>
			</footer>
		</div>
	);
}
