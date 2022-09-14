import { useState, useEffect, useContext } from 'react';
import useSWR from 'swr';
import fetchAPI from '../../functions/fetchAPI';

import parseChapterName from '../../functions/parseChapterName';

import Head from '../../components/Head';
import MediaCard from '../../components/MediaCard';
import NewMangaPopup from '../../components/Popups/NewMangaPopup';
import EditMangaCover from '../../components/Popups/EditMangaCover';
import EditMetadata from '../../components/Popups/EditMetadata';

import { ProfileContext } from '../../contexts/ProfileContext';
import { PopupContext } from '../../contexts/PopupContext';

import styles from './index.module.css';

export default function Mangas() {
	const [profileData] = useContext(ProfileContext);
	const [, popupActions] = useContext(PopupContext);

	const { data: mangas } = useSWR(
		`/users/${profileData.currentProfile._id}/mangas`
	);

	const { data: updates, error: updatesError } = useSWR(
		() =>
			'/getUpdates?' +
			new URLSearchParams({
				cache: true,
				mangas: mangas
					.filter(manga => manga.isSubscribed)
					.map(manga => manga._id),
			})
	);
	const isFetchingUpdates = !updates && !updatesError;
	const [showFinishedMangas, setShowFinishedMangas] = useState(false);

	return (
		<>
			<Head>
				<title>Choose a manga</title>
			</Head>

			<section className={styles.section1}>
				{mangas?.map(
					manga =>
						!manga.hasRead && (
							<MediaCard
								key={manga._id}
								type='manga'
								title={manga.name || manga.title}
								subtitle={parseChapterName(manga.currentChapter)}
								href={`/mangas/${manga.urlName}`}
								imgUrl={manga.coverUrl || manga.poster}
								completed={{ name: 'hasRead', value: manga.hasRead }}
								id={manga._id}
								seriesHref={null}
								dropdownItems={[
									{
										content: 'Edit metadata',
										icon: <i className='icon'>edit</i>,
										action: () => {
											popupActions.createPopup({
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
											popupActions.createPopup({
												title: 'Edit manga cover',
												content: EditMangaCover,
												data: manga,
											});
										},
									},
									{
										content: `${
											manga.isSubscribed ? 'Disable' : 'Enable'
										} updates`,
										icon: manga.isSubscribed ? (
											<i className='icon'>notifications_off</i>
										) : (
											<i className='icon'>notifications_active</i>
										),
										action: () => {
											if (
												window.confirm(
													'Are you sure you want to perform this action?'
												)
											) {
												fetchAPI(`/mangas/${manga._id}`, {
													method: 'PATCH',
													body: JSON.stringify({
														isSubscribed: !manga.isSubscribed,
													}),
												}).then(() => window.location.reload());
											}
										},
									},
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
												}).then(() => window.location.reload());
											}
										},
									},
								]}
								showSpinner={manga.isSubscribed && isFetchingUpdates}
								hasUpdates={!!updates?.[manga._id]}
							/>
						)
				)}
			</section>

			<section className={styles.section2} data-show={showFinishedMangas}>
				<button
					onClick={() => setShowFinishedMangas(!showFinishedMangas)}
					className={styles.toggleFinshedMangasButton}
				>
					<span>Finished reading</span>
					<i
						className='icon'
						style={{
							transform: `rotate(${showFinishedMangas ? 0 : -90}deg)`,
						}}
					>
						expand_more
					</i>
				</button>

				<div>
					{mangas?.map(
						manga =>
							manga.hasRead && (
								<MediaCard
									key={manga._id}
									type='manga'
									title={manga.name || manga.title}
									subtitle={parseChapterName(manga.currentChapter)}
									href={`/mangas/${manga.urlName}`}
									imgUrl={manga.coverUrl || manga.poster}
									completed={{ name: 'hasRead', value: manga.hasRead }}
									id={manga._id}
									seriesHref={null}
									dropdownItems={[
										{
											content: 'Edit metadata',
											icon: <i className='icon'>edit</i>,
											action: () => {
												popupActions.createPopup({
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
												popupActions.createPopup({
													title: 'Edit manga cover',
													content: EditMangaCover,
													data: manga,
												});
											},
										},
										{
											content: `${
												manga.isSubscribed ? 'Disable' : 'Enable'
											} updates`,
											icon: manga.isSubscribed ? (
												<i className='icon'>notifications_off</i>
											) : (
												<i className='icon'>notifications_active</i>
											),
											action: () => {
												if (
													window.confirm(
														'Are you sure you want to perform this action?'
													)
												) {
													fetchAPI(`/mangas/${manga._id}`, {
														method: 'PATCH',
														body: JSON.stringify({
															isSubscribed: !manga.isSubscribed,
														}),
													}).then(() => window.location.reload());
												}
											},
										},
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
													}).then(() => window.location.reload());
												}
											},
										},
									]}
								/>
							)
					)}
				</div>
			</section>

			<button
				className={styles.newManga}
				onClick={() => {
					popupActions.createPopup({
						title: 'Search for a new manga',
						content: NewMangaPopup,
					});
				}}
			>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
					<g>
						<g>
							<path d='M18,13h-5v5c0,0.55-0.45,1-1,1l0,0c-0.55,0-1-0.45-1-1v-5H6c-0.55,0-1-0.45-1-1l0,0c0-0.55,0.45-1,1-1h5V6 c0-0.55,0.45-1,1-1l0,0c0.55,0,1,0.45,1,1v5h5c0.55,0,1,0.45,1,1l0,0C19,12.55,18.55,13,18,13z' />
						</g>
					</g>
				</svg>
			</button>
		</>
	);
}
