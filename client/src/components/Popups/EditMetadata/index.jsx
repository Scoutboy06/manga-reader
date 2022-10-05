import { useState, useContext } from 'react';
import { useSWRConfig } from 'swr';

import fetchAPI from '../../../functions/fetchAPI.js';

import { ProfileContext } from './../../../contexts/ProfileContext';

import styles from './EditMetadata.module.css';

export default function EditMetadata({ closePopup, data: manga }) {
	const { mutate } = useSWRConfig();
	const [{ currentProfile }] = useContext(ProfileContext);

	const [title, setName] = useState(manga.title);
	const [urlName, setUrlName] = useState(manga.urlName);

	const [status, setStatus] = useState(manga.status);
	const [isFavorite, setIsFavorite] = useState(manga.isFavorite);
	const [hasRead, setHasRead] = useState(manga.hasRead);
	const [notificationsOn, setNotificationsOn] = useState(manga.notificationsOn);

	const submitHandler = async e => {
		e.preventDefault();

		const newData = {
			title,
			urlName,
			status,
			isFavorite,
			hasRead,
			notificationsOn,
		};

		fetchAPI(`/mangas/${manga._id}`, {
			method: 'PATCH',
			body: JSON.stringify(newData),
		});

		mutate(`/users/${currentProfile._id}/mangas`, () => {}, {
			revalidate: false,
			populateCache: (_, mangas) => {
				const thisManga = mangas.find(m => m._id === manga._id);
				for (const key of Object.keys(newData)) {
					thisManga[key] = newData[key];
				}
				return mangas;
			},
		});

		closePopup();
	};

	return (
		<form className={styles.container} onSubmit={submitHandler}>
			<main className={styles.main}>
				{/* Title */}
				<div className={styles.formGroup}>
					<label htmlFor='title'>Title:</label>
					<input
						type='text'
						name='title'
						id='title'
						value={title}
						onChange={e => setName(e.target.value)}
					/>
				</div>

				{/* Url name */}
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

				{/* Status */}
				<div className={styles.formGroup}>
					<label htmlFor='status'>Status:</label>
					<select
						name='status'
						id='status'
						defaultValue={manga.status}
						onChange={e => setStatus(e.target.value)}
					>
						<option value='ongoing'>Ongoing</option>
						<option value='completed'>Completed</option>
					</select>
				</div>

				{/* Favorite */}
				<div className={styles.formGroup}>
					<label htmlFor='isFavorite'>Favorite:</label>
					<button
						type='button'
						className='checkbox'
						name='isFavorite'
						id='isFavorite'
						data-ischecked={isFavorite}
						onClick={() => setIsFavorite(!isFavorite)}
					></button>
				</div>

				{/* Has read */}
				<div className={styles.formGroup}>
					<label htmlFor='hasRead'>Finished reading:</label>
					<button
						type='button'
						className='checkbox'
						name='hasRead'
						id='hasRead'
						data-ischecked={hasRead}
						onClick={() => {
							if (!hasRead) setNotificationsOn(false);
							setHasRead(!hasRead);
						}}
					></button>
				</div>

				{/* Notifications on */}
				<div className={styles.formGroup}>
					<label htmlFor='notificationsOn'>Enable notifications:</label>
					<button
						type='button'
						className='checkbox'
						name='notificationsOn'
						id='notificationsOn'
						data-ischecked={notificationsOn}
						disabled={hasRead}
						onClick={() => setNotificationsOn(!notificationsOn)}
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
