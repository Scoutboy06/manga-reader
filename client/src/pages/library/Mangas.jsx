import { useState, useContext } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import fetchAPI from '../../functions/fetchAPI';

import parseChapterName from '../../functions/parseChapterName';

import Head from '../../components/Head';
import MediaCard from '../../components/MediaCard';
import EditMangaCover from '../../components/Popups/EditMangaCover';
import EditMetadata from '../../components/Popups/EditMetadata';

import { ProfileContext } from '../../contexts/ProfileContext';
import { PopupContext } from '../../contexts/PopupContext';

import styles from './index.module.css';

export default function Mangas() {
	const navigate = useNavigate();

	const [profileData] = useContext(ProfileContext);
	const [, popupActions] = useContext(PopupContext);

	const { data: mangas, mutate: updateLibrary } = useSWR(
		`/users/${profileData.currentProfile._id}/mangas`,
		{
			revalidateIfStale: true,
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
		}
	);

	const [showFinishedMangas, setShowFinishedMangas] = useState(false);

	return (
		<>
			<Head>
				<title>Choose a manga</title>
			</Head>

			<main>
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
										manga.status === 'ongoing'
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
											'divider',
											{
												content: 'Read again',
												icon: <i className='icon'>replay</i>,
												action: async () => {
													const { chapters } = await fetchAPI(
														`/mangas/${manga._id}`
													);

													fetchAPI(`/mangas/${manga._id}`, {
														method: 'PATCH',
														body: JSON.stringify({ hasRead: false }),
													});

													navigate(
														`/mangas/${manga.urlName}/${chapters[0].urlName}`
													);
												},
											},
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
									/>
								)
						)}
					</div>
				</section>
			</main>
		</>
	);
}
