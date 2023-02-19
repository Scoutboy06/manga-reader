import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import fetchAPI from '../../functions/fetchAPI';

import DropdownButton from '../DropdownButton';
import SearchTMDB from '../Popups/SearchTMDB';

import { ProfileContext } from '../../contexts/ProfileContext';
import { PopupContext } from '../../contexts/PopupContext';

import styles from './AddToLibraryButton.module.css';

export default function AddToLibraryButton({ animeMeta }) {
	const params = useParams();
	const { mutate } = useSWRConfig();
	const [{ currentProfile }] = useContext(ProfileContext);
	const [, popupActions] = useContext(PopupContext);

	const addToLibrary = async () => {
		const res = await fetchAPI(`/users/${currentProfile._id}/animes`, {
			method: 'POST',
			body: JSON.stringify({
				urlName: animeMeta.urlName,
				importFields: false,
			}),
		});
		console.log(res);
		if (res.ok) {
			mutate(`/users/${currentProfile._id}/animes/${params.name}`);
		}
	};

	const importFromTMDB = async () => {
		popupActions.createPopup({
			title: 'Search on TMDB',
			content: SearchTMDB,
			data: animeMeta,
		});
	};

	return (
		<div className={styles.buttonGroup}>
			<button onClick={() => addToLibrary()}>Add to library</button>

			<DropdownButton
				className='icon'
				noPadding={true}
				dropdownItems={[
					{
						content: (
							<button
								className={styles.submitButton}
								onClick={() => importFromTMDB()}
							>
								Import from TMDB
							</button>
						),
						noHover: true,
					},
				]}
			>
				expand_more
			</DropdownButton>
		</div>
	);
}
