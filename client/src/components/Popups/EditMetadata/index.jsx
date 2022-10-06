import { useState, useContext } from 'react';
import { useSWRConfig } from 'swr';

import fetchAPI from '../../../functions/fetchAPI.js';
import useFormCreator from './../../../hooks/useFormCreator';
import { ProfileContext } from './../../../contexts/ProfileContext';

import styles from './EditMetadata.module.css';

export default function EditMetadata({ closePopup, data: manga }) {
	const { mutate } = useSWRConfig();
	const [{ currentProfile }] = useContext(ProfileContext);

	const [formStates, formElements] = useFormCreator([
		{
			label: 'Title:',
			name: 'title',
			type: 'input',
			defaultValue: manga.title,
		},
		{
			label: 'URL-name:',
			name: 'urlName',
			type: 'input',
			defaultValue: manga.urlName,
		},
		{
			label: 'Status:',
			name: 'status',
			type: 'select',
			defaultValue: manga.status,
			options: [
				{ value: 'ongoing', displayName: 'Ongoing' },
				{ value: 'completed', displayName: 'Completed' },
			],
		},
		{
			label: 'Finished reading:',
			name: 'hasRead',
			type: 'checkbox',
			defaultValue: manga.hasRead,
			disabled: states => states.status === 'ongoing',
			forceValue: states => (states.status === 'ongoing' ? false : null),
		},
		{
			label: 'Enable notifications:',
			name: 'notificationsOn',
			type: 'checkbox',
			defaultValue: manga.notificationsOn,
			disabled: states => states.status === 'completed',
			forceValue: states => (states.status === 'completed' ? false : null),
		},
	]);

	const submitHandler = async e => {
		e.preventDefault();

		fetchAPI(`/mangas/${manga._id}`, {
			method: 'PATCH',
			body: JSON.stringify(formStates),
		});

		mutate(`/users/${currentProfile._id}/mangas`, () => {}, {
			revalidate: false,
			populateCache: (_, mangas) => {
				const thisManga = mangas.find(m => m._id === manga._id);
				for (const key of Object.keys(formStates)) {
					thisManga[key] = formStates[key];
				}
				return mangas;
			},
		});

		closePopup();
	};

	return (
		<form className={styles.container} onSubmit={submitHandler}>
			<main className={styles.main}>{formElements}</main>

			<footer className={styles.footer}>
				<button type='reset' onClick={closePopup}>
					Cancel
				</button>
				<button type='submit'>Save changes</button>
			</footer>
		</form>
	);
}
