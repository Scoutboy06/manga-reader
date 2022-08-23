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

// const data = [
// 	{
// 		title: 'Continue watching',
// 		type: 'video',
// 		media: [
// 			{
// 				_id: 'horimiya',
// 				episodeNumber: 8,
// 				imgUrl: 'https://gogocdn.net/cover/horimiya.png',
// 				title: 'Horimiya',
// 				subtitle: 'Episode 8',
// 				isInLibrary: false,
// 				watched: false,
// 			},
// 			{
// 				_id: 'kimetsu-no-yaiba',
// 				episodeNumber: 4,
// 				imgUrl: 'https://gogocdn.net/cover/kimetsu-no-yaiba.png',
// 				title: 'Kimetsu no Yaiba',
// 				subtitle: 'Episode 4',
// 				isInLibrary: true,
// 				watched: false,
// 			},
// 			{
// 				_id: 'kanojo-okarishimasu-2nd-season',
// 				episodeNumber: 1,
// 				imgUrl: 'https://gogocdn.net/cover/kanojo-okarishimasu-2nd-season.png',
// 				title: 'Kanojo, Okarishimasu 2nd Season',
// 				subtitle: 'Episode 1',
// 				isInLibrary: false,
// 				watched: false,
// 			},
// 		],
// 	},
// 	{
// 		title: 'Your favorites',
// 		type: 'series',
// 		media: [
// 			{
// 				_id: 'mushoku-tensei-isekai-ittara-honki-dasu',
// 				episodeNumber: 1,
// 				imgUrl:
// 					'https://gogocdn.net/cover/mushoku-tensei-isekai-ittara-honki-dasu.png',
// 				title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
// 				watched: true,
// 				isInLibrary: true,
// 				updatesEnabled: true,
// 			},
// 			{
// 				_id: 'shingeki-no-kyojin',
// 				episodeNumber: 1,
// 				imgUrl: 'https://gogocdn.net/images/anime/Shingeki-no-Kyojin.jpg',
// 				title: 'Shingeki no Kyojin',
// 				watched: true,
// 				isInLibrary: true,
// 				updatesEnabled: true,
// 			},
// 			{
// 				_id: 'kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen',
// 				episodeNumber: 1,
// 				imgUrl:
// 					'https://gogocdn.net/cover/kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen.png',
// 				title: 'Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen',
// 				watched: false,
// 				isInLibrary: true,
// 				updatesEnabled: false,
// 			},
// 			{
// 				_id: 'horimiya',
// 				episodeNumber: 1,
// 				imgUrl: 'https://gogocdn.net/cover/horimiya.png',
// 				title: 'Horimiya',
// 				watched: false,
// 				isInLibrary: true,
// 				updatesEnabled: true,
// 			},
// 			{
// 				_id: 'death-note',
// 				episodeNumber: 1,
// 				imgUrl: 'https://gogocdn.net/cover/death-note.png',
// 				title: 'Death Note',
// 				watched: false,
// 				isInLibrary: true,
// 				updatesEnabled: false,
// 			},
// 			{
// 				_id: 'spy-x-family',
// 				episodeNumber: 1,
// 				imgUrl: 'https://gogocdn.net/cover/spy-x-family.png',
// 				title: 'Spy x Family',
// 				watched: false,
// 				isInLibrary: true,
// 				updatesEnabled: false,
// 			},
// 			{
// 				_id: 'vinland-saga',
// 				episodeNumber: 1,
// 				imgUrl: 'https://gogocdn.net/cover/vinland-saga.png',
// 				title: 'Vinland Saga',
// 				watched: false,
// 				isInLibrary: true,
// 				updatesEnabled: false,
// 			},
// 			{
// 				_id: 'kimetsu-no-yaiba',
// 				episodeNumber: 1,
// 				imgUrl: 'https://gogocdn.net/cover/kimetsu-no-yaiba.png',
// 				title: 'Kimetsu no Yaiba',
// 				watched: false,
// 				isInLibrary: true,
// 				updatesEnabled: false,
// 			},
// 			{
// 				_id: 'rezero-kara-hajimeru-isekai-seikatsu',
// 				episodeNumber: 1,
// 				imgUrl:
// 					'https://gogocdn.net/cover/rezero-kara-hajimeru-isekai-seikatsu.jpg',
// 				title: 'Re:Zero kara Hajimeru Isekai Seikatsu',
// 				watched: false,
// 				isInLibrary: true,
// 				updatesEnabled: false,
// 			},
// 			{
// 				_id: 'seishun-buta-yarou-wa-bunny-girl-senpai-no-yume-wo-minai',
// 				episodeNumber: 1,
// 				imgUrl:
// 					'https://gogocdn.net/cover/seishun-buta-yarou-wa-bunny-girl-senpai-no-yume-wo-minai.png',
// 				title: 'Seishun Buta Yarou wa Bunny Girl Senpai no Yume wo Minai',
// 				watched: false,
// 				isInLibrary: true,
// 				updatesEnabled: false,
// 			},
// 			{
// 				_id: 'violet-evergarden',
// 				episodeNumber: 1,
// 				imgUrl: 'https://gogocdn.net/cover/violet-evergarden.png',
// 				title: 'Violet Evergarden',
// 				watched: false,
// 				isInLibrary: true,
// 				updatesEnabled: false,
// 			},
// 		],
// 	},
// ];

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
				{data &&
					data.map(
						(section, i) =>
							section.media.length > 0 && (
								<HorizontalScrollContainer
									key={`Section_${i}`}
									title={<h1 className={styles.title}>{section.title}</h1>}
								>
									{section.media.map((media, j) => (
										<MediaCard
											key={media._id}
											type={section.type}
											href={`/animes/${media.urlName}${
												section.type === 'video'
													? `/episode-${
															media.episodes.find(
																episode => episode.status === ''
															).number
													  }`
													: ''
											}`}
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
														console.log('elo');
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
											// 	'divider',
											// 	{
											// 		action: () => {
											// 			if (
											// 				window.confirm(
											// 					'Are you sure you want to delete this manga? The action cannot be undone.'
											// 				)
											// 			) {
											// 				fetchAPI(`/mangas/${manga._id}`, {
											// 					method: 'DELETE',
											// 				}).then(() => window.location.reload());
											// 			}
											// 		},
											// 		icon: <i className='icon'>delete</i>,
											// 		content: 'Delete',
											// 	},
											// ]}
										/>
									))}
								</HorizontalScrollContainer>
							)
					)}
			</main>
		</>
	);
}
