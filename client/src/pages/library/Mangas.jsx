import { useState, useContext } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import fetchAPI from '../../functions/fetchAPI';

import parseChapterName from '../../functions/parseChapterName';

import Head from '../../components/Head';
import MediaCard from '../../components/MediaCard';
import EditMangaCover from '../../components/Popups/EditMangaCover';
import EditMetadata from '../../components/Popups/EditMetadata';
import HorizontalScrollContainer from '../../components/HorizontalScrollContainer';

import { ProfileContext } from '../../contexts/ProfileContext';
import { PopupContext } from '../../contexts/PopupContext';

import styles from './index.module.css';
/*
- My List (db)

- Continue Reading (db)

- Popular Manga (MAL)
- Top 10 Most Popular Manga (MAL)
- Top One Shots (MAL)

--- Genres (db)

- Read again
*/

export default function Mangas() {
	const navigate = useNavigate();

	const [{ currentProfile }] = useContext(ProfileContext);
	const [, { createPopup }] = useContext(PopupContext);

	const { data: mangas, mutate: updateLibrary } = useSWR(
		`/users/${currentProfile._id}/mangas`,
		{
			revalidateIfStale: true,
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
		}
	);

	const sections = [
		{
			title: 'My List',
			data: mangas?.filter(manga => manga.isFavorite),
		},
		{
			title: 'Continue Reading',
			data: mangas?.filter(manga => manga.readStatus === 'reading'),
		},
		{
			title: 'Read again',
			data: mangas?.filter(manga => manga.readStatus === 'finished'),
		},
	];

	return (
		<>
			<Head>
				<title>Choose a manga</title>
			</Head>

			<main className={styles.main}>
				{sections
					.filter(section => section.data?.length > 0)
					.map(section => (
						<HorizontalScrollContainer
							key={section.title}
							title={section.title}
						>
							{section.data.map(manga => (
								<MediaCard
									key={manga._id}
									orentation='vertical'
									title={manga.title}
									subtitle={'Chapter ' + manga.currentChapter.number}
									href={`/mangas/${manga.urlName}/${manga.currentChapter.urlName}`}
									imgUrl={manga.poster}
									dropdownItems={[
										manga.readStatus === 'completed'
											? {
													content: 'Read again',
													icon: <i className='icon'>replay</i>,
													action: async () => {
														const { chapters } = await fetchAPI(
															`/mangas/${manga._id}`
														);

														fetchAPI(`/mangas/${manga._id}`, {
															method: 'PATCH',
															body: JSON.stringify({ readStatus: 'reading' }),
														});

														navigate(
															`/mangas/${manga.urlName}/${chapters[0].urlName}`
														);
													},
											  }
											: null,
										{
											content: 'Edit metadata',
											icon: <i className='icon'>edit</i>,
											action: () => {
												createPopup({
													title: 'Edit metadata',
													content: EditMetadata,
													data: manga,
												});
											},
										},
										{
											content: 'Edit cover',
											icon: <i className='icon'>image</i>,
											action: () => {
												createPopup({
													title: 'Edit manga cover',
													content: EditMangaCover,
													data: manga,
												});
											},
										},
										manga.airStatus === 'ongoing'
											? {
													content: `${
														manga.notificationsOn ? 'Disable' : 'Enable'
													} notifications`,
													icon: (
														<i className='icon'>
															{manga.notificationsOn
																? 'notifications_off'
																: 'notifications_active'}
														</i>
													),
													action: () => {
														fetchAPI(`/mangas/${manga._id}`, {
															method: 'PATCH',
															body: JSON.stringify({
																notificationsOn: !manga.notificationsOn,
															}),
														}).then(() => updateLibrary());
													},
											  }
											: null,
										'divider',
										{
											content: 'Delete',
											icon: <i className='icon'>delete</i>,
											action: () => {
												if (
													window.confirm(
														'Are you sure you want to delete this manga? The action cannot be undone.'
													)
												) {
													fetchAPI(`/mangas/${manga._id}`, {
														method: 'DELETE',
													}).then(() => updateLibrary());
												}
											},
										},
									]}
									hasUpdates={manga.hasUpdates}
								/>
							))}
						</HorizontalScrollContainer>
					))}
			</main>
		</>
	);
}
