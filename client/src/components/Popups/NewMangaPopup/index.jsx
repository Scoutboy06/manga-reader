import { useState, useContext } from 'react';
import { ProfileContext } from '../../../contexts/ProfileContext';
import fetchAPI from '../../../functions/fetchAPI';

import Loader from '../../Loader';

import styles from './NewMangaPopup.module.css';

export default function NewMangaPopup({ closePopup }) {
	const [profileData] = useContext(ProfileContext);

	const [inputText, setInputText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [payload, setPayload] = useState();
	const [isSubscribed, setIsSubscribed] = useState(true);

	const [selectedData, setSelectedData] = useState();
	const [selectedEl, setSelectedEl] = useState();

	const reset = () => {
		setInputText('');
		setIsLoading(false);
		setPayload();
		setIsSubscribed(true);
		setSelectedData();
		setSelectedEl();
	};

	const searchSubmit = e => {
		e.preventDefault();

		setPayload();
		setIsLoading(true);

		fetchAPI('/api/search?mangaName=' + inputText).then(json => {
			setIsLoading(false);
			setPayload(json);
		});
	};

	const handleSelectEl = (e, hostIndex, mangaIndex) => {
		if (selectedEl) {
			selectedEl.removeAttribute('selected');
		}

		const el = e.nativeEvent.path.reverse()[11];
		el.setAttribute('selected', '');
		setSelectedEl(el);

		setSelectedData({
			hostName: payload[hostIndex].hostName,
			mangaUrlName: payload[hostIndex].mangas[mangaIndex].urlName,
		});
	};

	const addSubmit = () => {
		if (!selectedData) return;

		fetchAPI('/api/mangas', {
			method: 'POST',
			body: JSON.stringify({
				...selectedData,
				subscribed: isSubscribed,
				userId: profileData.currentProfile._id,
			}),
		}).then(() => window.location.reload());
	};

	return (
		<div className={styles.container}>
			<main className={styles.main}>
				<form onSubmit={searchSubmit} className={styles.inputContainer}>
					<input
						type='text'
						placeholder='Search for a manga...'
						value={inputText}
						onChange={e => setInputText(e.target.value)}
						autoCapitalize='off'
						autoCorrect='off'
						className={styles.input}
					/>

					<button
						type='reset'
						className={
							styles.resetBtn + (inputText.length === 0 ? ' hidden' : '')
						}
						onClick={() => reset()}
					>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M18,13h-5v5c0,0.55-0.45,1-1,1l0,0c-0.55,0-1-0.45-1-1v-5H6c-0.55,0-1-0.45-1-1l0,0c0-0.55,0.45-1,1-1h5V6 c0-0.55,0.45-1,1-1l0,0c0.55,0,1,0.45,1,1v5h5c0.55,0,1,0.45,1,1l0,0C19,12.55,18.55,13,18,13z' />
						</svg>
					</button>

					<button type='submit' className={styles.submitBtn}>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M20.29,18.88l-5.56-5.56c1.13-1.55,1.63-3.58,0.98-5.74c-0.68-2.23-2.57-3.98-4.85-4.44C6.21,2.2,2.2,6.22,3.14,10.86 c0.46,2.29,2.21,4.18,4.44,4.85c2.16,0.65,4.19,0.15,5.74-0.98l5.56,5.56c0.39,0.39,1.02,0.39,1.41,0l0,0 C20.68,19.9,20.68,19.27,20.29,18.88z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z' />
						</svg>
					</button>
				</form>

				{isLoading && (
					<Loader
						size={60}
						style={{
							position: 'absoulte',
							left: 'calc(50% - 30px)',
							top: '160px',
						}}
					/>
				)}

				{payload &&
					!isLoading &&
					payload.map((host, hostIndex) => (
						<div key={hostIndex}>
							<div className={styles.hostName}>{host.hostName}</div>

							{host.mangas.map((manga, mangaIndex) => (
								<div
									key={manga.urlName}
									className={styles.mangaItem}
									onClick={e => handleSelectEl(e, hostIndex, mangaIndex)}
								>
									<img
										className={styles.mangaImage}
										src={manga.imgUrl}
										alt='Manga cover'
									/>
									<div className={styles.mangaDetails}>
										<span>{manga.mangaName}</span>
										<span>{manga.latestChapter}</span>
										<span>{manga.latestUpdate}</span>
									</div>

									<button
										className={styles.openSource + ' button'}
										onClick={() => window.open(manga.detailsPage, '_blank')}
									>
										<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
											<path d='M0 0h24v24H0V0z' fill='none' />
											<path d='M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z' />
										</svg>
									</button>
								</div>
							))}
						</div>
					))}
			</main>

			<footer className={styles.footer}>
				<div className={styles.subscribed}>
					<label htmlFor='subscribed'>Subscribed:</label>
					<button
						className='checkbox'
						type='button'
						id='subscribed'
						data-ischecked={isSubscribed}
						onClick={() => setIsSubscribed(bool => !bool)}
					></button>
				</div>
				<div>
					<button type='reset' onClick={() => closePopup()}>
						Cancel
					</button>
					<button type='submit' onClick={addSubmit} disabled={!selectedData}>
						Add to library
					</button>
				</div>
			</footer>
		</div>
	);
}
