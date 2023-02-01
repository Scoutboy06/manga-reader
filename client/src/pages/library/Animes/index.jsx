import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchAPI from '../../../functions/fetchAPI';
import useSWR from 'swr';

import Head from '../../../components/Head';
import MediaCard from '../../../components/MediaCard';
import HorizontalScrollContainer from '../../../components/HorizontalScrollContainer';
import EditAnimeMetadata from '../../../components/Popups/EditAnimeMetadata';

import { PopupContext } from '../../../contexts/PopupContext';
import { ProfileContext } from '../../../contexts/ProfileContext';

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
	const navigate = useNavigate();
	const [, { createPopup }] = useContext(PopupContext);
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
												createPopup({
													title: 'Edit metadata',
													content: EditAnimeMetadata,
													data: anime,
												});
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
				{/* {data?.map(
					(section, i) =>
						section.media.length > 0 && (
							<HorizontalScrollContainer
								key={`Section_${i}`}
								title={section.title}
							>
								{section.media.map(media => (
									<MediaCard
										key={media._id}
										orentation={section.type}
										href={`/animes/${media.urlName}`}
										seriesHref={`/animes/${media.urlName}`}
										imgUrl={
											section.type === 'video'
												? media.backdrop.small
												: media.poster.small
										}
										title={media.title}
										subtitle={media.subtitle}
										id={media._id}
										finished={media.hasWatched}
										hasUpdates={media.hasNewEpisodes}
										dropdownItems={[
											{
												content: 'Edit metadata',
												icon: <i className='icon'>edit</i>,
												action: () => {
													popupActions.createPopup({
														title: 'Edit metadata',
														content: EditAnimeMetadata,
														data: media,
													});
												},
											},
											{
												content: 'Edit cover',
												icon: <i className='icon'>image</i>,
												action: () => {
													// popupActions.createPopup({
													// 	title: 'Edit manga cover',
													// 	content: EditMangaCover,
													// 	data: manga,
													// });
												},
											},
											media.isAiring
												? {
														content:
															(media.notificationsOn ? 'Disable' : 'Enable') +
															' notifications',
														icon: (
															<i className='icon'>
																{media.notificationsOn
																	? 'notifications_off'
																	: 'notifications_active'}
															</i>
														),
														action: () => {
															fetchAPI(`/animes/${media._id}`, {
																method: 'PATCH',
																body: JSON.stringify({
																	notificationsOn: !media.notificationsOn,
																}),
															});
														},
												  }
												: null,
											'divider',
											{
												content: 'Delete',
												icon: <i className='icon'>delete</i>,
												action: () => {
													fetchAPI(`/animes/${media._id}`, {
														method: 'DELETE',
													});
													mutate();
												},
											},
										]}
									/>
								))}
							</HorizontalScrollContainer>
						)
				)} */}
			</main>
		</>
	);
}
