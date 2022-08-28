import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import fetchAPI from '../../../functions/fetchAPI';
import useSWR from 'swr';

import Head from '../../../components/Head';
import MediaCard from '../../../components/MediaCard';
import HorizontalScrollContainer from '../../../components/HorizontalScrollContainer';
import EditMetadata from '../../../components/Popups/EditMetadata';

import { PopupContext } from '../../../contexts/PopupContext';
import { ProfileContext } from '../../../contexts/ProfileContext';

import styles from './Animes.module.css';

export default function Animes() {
	const navigate = useNavigate();
	const [, popupActions] = useContext(PopupContext);
	const [{ currentProfile }] = useContext(ProfileContext);

	const { data } = useSWR(() => `/users/${currentProfile._id}/animes`);

	return (
		<>
			<Head>
				<title>Choose an anime</title>
			</Head>

			<main style={{ padding: '0 var(--padding)' }}>
				{data?.map(
					(section, i) =>
						section.media.length > 0 && (
							<HorizontalScrollContainer
								key={`Section_${i}`}
								title={<h1 className={styles.title}>{section.title}</h1>}
							>
								{section.media.map(media => (
									<MediaCard
										key={media._id}
										type={section.type}
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
										dropdownItems={[
											{
												content: 'Play',
												icon: <i className='icon'>play_arrow</i>,
												action: () => {
													navigate(
														`/animes/${media._id}/episode-${media.episodeNumber}`
													);
												},
											},
											'divider',
											{
												content: 'Edit metadata',
												icon: <i className='icon'>edit</i>,
												action: () => {
													// popupActions.createPopup({
													// 	title: 'Edit metadata',
													// 	content: EditMetadata,
													// 	data: media,
													// });
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
											media.updatesEnabled !== undefined
												? {
														content:
															(media.updatesEnabled ? 'Disable' : 'Enable') +
															' updates',
														icon: media.updatesEnabled ? (
															<i className='icon'>notifications_off</i>
														) : (
															<i className='icon'>notifications_active</i>
														),
														action: () => {
															// if (
															// 	window.confirm(
															// 		'Are you sure you want to perform this action?'
															// 	)
															// ) {
															// 	fetchAPI(`/animes/${media._id}`, {
															// 		method: 'PATCH',
															// 		body: JSON.stringify({ isSubscribed: !media.isSubscribed }),
															// 	}).then(() => window.location.reload());
															// }
														},
												  }
												: null,
										]}
									/>
								))}
							</HorizontalScrollContainer>
						)
				)}
			</main>
		</>
	);
}
