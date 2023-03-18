import { useContext } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Head from 'next/head';
import fetchAPI from '@/functions/fetchAPI';

import MediaCard from '@/components/MediaCard';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';
import EditAnimeMetadata from '@/components/Popups/EditAnimeMetadata';
import Navbar from '@/components/navbars/Library';

// import { PopupContext } from '@/contexts/PopupContext';
import { ProfileContext } from '@/contexts/ProfileContext';

/*
	Continue watching
		(New episodes - subscribed)
	Your favorites
	Popular
	(Example genres)
	New season
	Recent realease
	(Popular ongoing update)
	*/

export default function Animes() {
	const router = useRouter();
	// const [, { createPopup }] = useContext(PopupContext);
	const [{ currentProfile }] = useContext(ProfileContext);

	const { data: animes, mutate } = useSWR(
		() => `/users/${currentProfile._id}/animes`,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
		}
	);

	const sections = [
		{
			title: 'Continue watching',
			data: animes?.filter(anime => anime),
			orientation: 'horizontal',
		},
		{
			title: 'Your favorites',
			data: animes?.filter(anime => anime.isFavorite),
			orientation: 'vertical',
		},
		{
			title: 'Popular',
			data: null,
			orientation: 'vertical',
		},
		{
			title: 'New season',
			data: null,
			orientation: 'vertical',
		},
		{
			title: 'Recent release',
			data: null,
			orientation: 'vertical',
		},
	];

	return (
		<>
			<Head>
				<title>Choose an anime</title>
			</Head>

			<Navbar />

			<main style={{ padding: '0 var(--padding)' }}>
				{sections
					.filter(section => section.data)
					.map(section => (
						<HorizontalScrollContainer
							key={section.title}
							title={section.title}
						>
							{section.data.map(anime => (
								<MediaCard
									key={anime._id}
									orientation={section.orientation}
									title={anime.title}
									// subtitle={}
									href={`/animes/${anime.urlName}`}
									imgUrl={
										section.orientation === 'vertical'
											? anime.poster.small
											: anime.backdrop.small
									}
									dropdownItems={[
										{
											content: 'Edit metadata',
											icon: <i className='icon'>edit</i>,
											action: () => {
												// createPopup({
												// 	title: 'Edit metadata',
												// 	content: EditAnimeMetadata,
												// 	data: anime,
												// });
											},
										},
										{
											content: 'Edit cover',
											icon: <i className='icon'>image</i>,
											action: () => {
												// createPopup({
												// 	title: 'Edit manga cover',
												// 	content: EditMangaCover,
												// 	data: manga,
												// });
											},
										},
										anime.isAiring
											? {
													content:
														(anime.notificationsOn ? 'Disable' : 'Enable') +
														' notifications',
													icon: (
														<i className='icon'>
															{anime.notificationsOn
																? 'notifications_off'
																: 'notifications_active'}
														</i>
													),
													action: () => {
														fetchAPI(`/animes/${anime._id}`, {
															method: 'PATCH',
															body: JSON.stringify({
																notificationsOn: !anime.notificationsOn,
															}),
														});
													},
											  }
											: null,
										'divider',
										{
											content: 'Delete',
											icon: <i className='icon'>delete</i>,
											action: async () => {
												await fetchAPI(`/animes/${anime._id}`, {
													method: 'DELETE',
												});
												mutate();
											},
										},
									]}
								/>
							))}
						</HorizontalScrollContainer>
					))}
			</main>
		</>
	);
}
