import { useContext } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import fetchAPI from '@/functions/fetchAPI';
import Head from 'next/head';

import MediaCard from '@/components/MediaCard';
// import EditMangaCover from '@/components/Popups/EditMangaCover';
// import EditMetadata from '@/components/Popups/EditMetadata';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';
import Navbar from '@/components/navbars/Library';

import { ProfileContext } from '@/contexts/ProfileContext';
import { PopupContext } from '@/contexts/PopupContext';

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
	const router = useRouter();

	const [{ currentProfile }] = useContext(ProfileContext);
	// const [, { createPopup }] = useContext(PopupContext);

	const { data: mangas, mutate: updateLibrary } = useSWR(
		() => `/users/${currentProfile._id}/mangas`,
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

			<Navbar />

			<main style={{ margin: '0 var(--padding)' }}>
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

														router.push(
															`/mangas/${manga.urlName}/${chapters[0].urlName}`
														);
													},
											  }
											: null,
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
