import { useState } from 'react';

import fetchAPI from '../../../functions/fetchAPI.js';

import styles from './EditMetadata.module.css';

export default function EditMetadata({ closePopup, data: manga }) {
	const [showAdvanced, setShowAdvanced] = useState(false);

	const [name, setName] = useState(manga.name);

	const [urlName, setUrlName] = useState(manga.urlName);
	const [currentChapter, setCurrentChapter] = useState(manga.currentChapter);
	const [isSubscribed, setIsSubscribed] = useState(manga.isSubscribed);
	const [hostId, setHostId] = useState(manga.hostId);

	const [hasFinishedReading, setHasFinishedReading] = useState(
		manga.hasFinishedReading
	);
	const [ownerId, setOwnerId] = useState(manga.ownerId);

	const submitHandler = e => {
		e.preventDefault();

		fetchAPI(`/mangas/${manga._id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				name,
				urlName,
				currentChapter,
				isSubscribed,
				hostId,
				hasFinishedReading,
				ownerId,
			}),
		}).then(() => window.location.reload());
	};

	return (
		<form className={styles.container} onSubmit={submitHandler}>
			<main className={styles.main}>
				<div className={styles.formGroup}>
					<label htmlFor='name'>Name:</label>
					<input
						type='text'
						name='name'
						id='name'
						value={name}
						onChange={e => setName(e.target.value)}
					/>
					<button onClick={() => setName(manga.originalName)} type='button'>
						Revert to original name
					</button>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='isSubscribed'>Subscribed:</label>
					<button
						type='button'
						className='checkbox'
						name='isSubscribed'
						id='isSubscribed'
						data-ischecked={isSubscribed}
						onClick={() => setIsSubscribed(bool => !bool)}
					></button>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='hasFinishedReading'>Finished reading:</label>
					<button
						type='button'
						className='checkbox'
						name='hasFinishedReading'
						id='hasFinishedReading'
						data-ischecked={hasFinishedReading}
						onClick={() => setHasFinishedReading(bool => !bool)}
					></button>
				</div>

				<div className={styles.formGroup}>
					<button
						type='button'
						onClick={() => setShowAdvanced(bool => !bool)}
						className={styles.toggleAdvanced}
					>
						{showAdvanced ? 'Hide' : 'Show'} advanced
					</button>
				</div>

				{showAdvanced && (
					<>
						<div className={styles.formGroup}>
							<label htmlFor='urlName'>URL-name:</label>
							<input
								type='text'
								name='urlName'
								id='urlName'
								value={urlName}
								onChange={e => setUrlName(e.target.value)}
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor='currentChapter'>Current chapter:</label>
							<input
								type='text'
								name='currentChapter'
								id='currentChapter'
								value={currentChapter}
								onChange={e => setCurrentChapter(e.target.value)}
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor='ownerId'>Owner ID:</label>
							<input
								type='text'
								name='ownerId'
								id='ownerId'
								value={ownerId}
								onChange={e => setOwnerId(e.target.value)}
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor='hostId'>Host ID:</label>
							<input
								type='text'
								name='hostId'
								id='hostId'
								value={hostId}
								onChange={e => setHostId(e.target.value)}
							/>
						</div>
					</>
				)}
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
