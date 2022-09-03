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
		// setPayload();
		setIsSubscribed(true);
		setSelectedData();
		setSelectedEl();
	};

	const searchSubmit = e => {
		e.preventDefault();

		setPayload();
		setIsLoading(true);

		fetchAPI(`/search?mangaName=${inputText}`, {}, true).then(json => {
			setIsLoading(false);
			setPayload(json);
		});
	};

	const handleSelectEl = (e, hostIndex, mangaIndex) => {
		if (selectedEl) {
			selectedEl.removeAttribute('selected');
		}

		const path = e.nativeEvent.composedPath();

		const el = path.reverse()[11];
		el.setAttribute('selected', '');
		setSelectedEl(el);

		setSelectedData({
			hostName: payload[hostIndex].hostName,
			urlName: payload[hostIndex].mangas[mangaIndex].urlName,
		});
	};

	const addSubmit = () => {
		if (!selectedData) return;

		fetchAPI(`/users/${profileData.currentProfile._id}/mangas`, {
			method: 'POST',
			body: JSON.stringify({
				...selectedData,
				isSubscribed,
				userId: profileData.currentProfile._id,
			}),
		}).then(res => {
			console.log(res);
			if (res.ok) window.location.reload();
		});
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
						className={`${styles.resetBtn} ${
							inputText.length === 0 ? 'hidden' : ''
						} icon`}
						onClick={() => reset()}
					>
						close
					</button>

					<button type='submit' className={styles.submitBtn + ' icon'}>
						search
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
						<div key={`_Host_${host.hostName}`}>
							<h2 className={styles.hostName}>{host.hostName}</h2>

							{host.mangas.map((manga, mangaIndex) => (
								<button
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

									<a
										className={styles.openSource + ' icon'}
										// onClick={() => window.open(manga.detailsPage, '_blank')}
										href={manga.detailsPage}
										target='_blank'
										rel='nofollow noreferrer noopener'
									>
										open_in_new
									</a>
								</button>
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
