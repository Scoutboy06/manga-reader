import { useContext } from 'react';
import { useSWRConfig } from 'swr';

import fetchAPI from '../../functions/fetchAPI.js';
import useFormCreator from '../../hooks/useFormCreator';
import { ProfileContext } from '../../contexts/ProfileContext';

import styles from './EditMetadata/EditMetadata.module.css';

export default function EditMetadata({ closePopup, data: { season, anime } }) {
	const { mutate } = useSWRConfig();
	const [{ currentProfile }] = useContext(ProfileContext);

	const [formStates, formElements] = useFormCreator([
		{
			label: 'Title:',
			name: 'title',
			type: 'input',
			defaultValue: season.name,
		},
		{
			label: 'URL-name:',
			name: 'urlName',
			type: 'input',
			defaultValue: season.urlName,
		},
		{
			label: 'Description:',
			name: 'description',
			type: 'textarea',
			defaultValue: season.description,
		},
		{
			label: 'Airing:',
			name: 'isAiring',
			type: 'checkbox',
			defaultValue: season.isAiring,
			// disabled: ({ hasWatched }) => hasWatched,
			// forceValue: ({ hasWatched }) => (hasWatched ? false : null),
		},
		// {
		// 	label: 'Enable notifications:',
		// 	name: 'notificationsOn',
		// 	type: 'checkbox',
		// 	defaultValue: season.notificationsOn,
		// 	disabled: ({ hasWatched, isAiring }) => hasWatched || !isAiring,
		// 	forceValue: ({ hasWatched, isAiring }) =>
		// 		hasWatched || !isAiring ? false : null,
		// },
		// {
		// 	label: 'Finished watching:',
		// 	name: 'hasWatched',
		// 	type: 'checkbox',
		// 	defaultValue: season.hasWatched,
		// 	forceValue: ({ isAiring }) => (isAiring ? false : null),
		// },
	]);

	const submitHandler = async e => {
		e.preventDefault();

		await fetchAPI(`/animes/${anime._id}/season/${season.urlName}`, {
			method: 'PATCH',
			body: JSON.stringify(formStates),
		});

		// mutate(`/users/${currentProfile._id}/animes/${anime._id}`);
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
