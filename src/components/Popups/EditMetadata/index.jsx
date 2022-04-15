import { useState } from 'react';

import fetchAPI from '../../../functions/fetchAPI.js';

import styles from './EditMetadata.module.css';

export default function EditMetadata({ closePopup, data: manga }) {
	const [mangaTitle, setMangaTitle] = useState(manga.name);
	const [subscribed, setSubscribed] = useState(manga.subscribed);
	const [finished, setFinished] = useState(manga.finished);

	const submitHandler = e => {
		e.preventDefault();

		fetchAPI('/api/mangas/' + manga._id, {
			method: 'PUT',
			body: JSON.stringify({
				name: mangaTitle,
				subscribed,
			}),
		}).then(() => window.location.reload());
	};

	return (
		<form className={styles.container} onSubmit={submitHandler}>
			<main className={styles.main}>
				<div className={styles.formGroup}>
					<label htmlFor='title'>Title:</label>
					<input
						type='text'
						name='title'
						id='title'
						value={mangaTitle}
						onChange={e => setMangaTitle(e.target.value)}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='subscribed'>Subscribed:</label>
					<button
						type='button'
						className='checkbox'
						name='subscribed'
						id='subscribed'
						data-ischecked={subscribed}
						onClick={() => setSubscribed(bool => !bool)}
					></button>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='finished'>Finished reading:</label>
					<button
						type='button'
						className='checkbox'
						name='finished'
						id='finished'
						data-ischecked={finished}
						onClick={() => setFinished(bool => !bool)}
					></button>
				</div>
			</main>

			<footer className={styles.footer}>
				<button type='reset' onClick={closePopup}>
					Cancel
				</button>
				<button type='submit'>Save changes</button>
			</footer>
		</form>
	);
}
