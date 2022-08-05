import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useParams, Outlet } from 'react-router-dom';

import fetchAPI from '../../functions/fetchAPI';

import Select from '../../components/Select';

import { ProfileContext } from '../../contexts/ProfileContext';
import { SettingsContext } from '../../contexts/SettingsContext';

import styles from './read.module.css';

export default function Read() {
	const params = useParams();
	const navigate = useNavigate();

	const [profileData] = useContext(ProfileContext);
	const [{ contentWidth }, { setContentWidth }] = useContext(SettingsContext);

	const [isLoading, setIsLoading] = useState(false);
	const [metadata, setMetadata] = useState();
	const [chapterMeta, setChapterMeta] = useState();

	const hasInit = useRef(false);

	const paginate = dir => {
		window.scrollTo(0, 0);
		const { chapters } = metadata;

		const currentChapter = chapters.find(
			chapter => chapter.urlName === params.chapter
		);
		const currentChapterIndex = chapters.indexOf(currentChapter);

		if (dir === -1) {
			const prevChapter = chapters[currentChapterIndex - 1];
			navigate(`/mangas/${metadata.urlName}/${prevChapter.urlName}`);
		} else if (dir === 1) {
			const nextChapter = chapters[currentChapterIndex + 1];
			navigate(`/mangas/${metadata.urlName}/${nextChapter.urlName}`);
		}
	};

	// Init
	useEffect(() => {
		async function init() {
			console.log('Init');
			hasInit.current = true;
			setIsLoading(true);

			const meta = await await fetchAPI(
				`/users/${profileData.currentProfile._id}/mangas?` +
					new URLSearchParams({
						query: params.name,
						limit: 1,
					}),
				{},
				false
			);
			setMetadata(meta[0]);

			if (!params.chapter) {
				navigate(`/mangas/${params.name}/${meta[0].currentChapter}`, {
					replace: true,
				});
			}

			setIsLoading(false);
		}

		if (!hasInit.current && profileData.currentProfile) init();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params, profileData]);

	// Load new chapter
	useEffect(() => {
		async function loadChapter() {
			setIsLoading(true);

			const chapMeta = await fetchAPI(
				`/mangas/${metadata._id}/${params.chapter}`,
				{},
				true
			);

			setChapterMeta(chapMeta);
			setIsLoading(false);

			// Sync chapter with server
			fetchAPI(`/mangas/${metadata._id}/updates`, {
				method: 'PATCH',
				body: JSON.stringify({
					chapter: params.chapter,
					isLast: !chapMeta.nextPath,
				}),
			});
		}

		if (metadata) loadChapter();
	}, [metadata, params]);

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>Chapter {chapterMeta?.chapterTitle}</h2>

				<div className={styles.container} style={{ marginBottom: 30 }}>
					<a
						href={chapterMeta?.originalUrl}
						target='_blank'
						rel='nofollow noreferrer noopener'
						className='button'
						disabled={isLoading || !chapterMeta?.originalUrl}
					>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M0 0h24v24H0V0z' fill='none' />
							<path d='M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z' />
						</svg>
					</a>

					<Select
						value={contentWidth}
						onChange={({ value }) =>
							setContentWidth(value === 'pageWidth' ? 'pageWidth' : value)
						}
					>
						<option value='pageWidth'>Page width</option>
						<hr />
						<option value={0.5} default={contentWidth === 0.5}>
							50%
						</option>
						<option value={0.75} default={contentWidth === 0.75}>
							75%
						</option>
						<option value={0.9} default={contentWidth === 0.9}>
							90%
						</option>
						<option value={1.0} default={contentWidth === 1.0}>
							100%
						</option>
						<option value={1.25} default={contentWidth === 1.25}>
							125%
						</option>
						<option value={1.5} default={contentWidth === 1.5}>
							150%
						</option>
						<option value={2.0} default={contentWidth === 2.0}>
							200%
						</option>
					</Select>
				</div>

				<div className={styles.container}>
					<button
						onClick={() => paginate(-1)}
						className='button icon-left'
						disabled={isLoading || !chapterMeta?.prevPath}
					>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M0 0h24v24H0V0z' fill='none' />
							<path d='M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z' />
						</svg>
						<span>Prev</span>
					</button>
					<Link to='/mangas' className='button'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M0 0h24v24H0V0z' fill='none' />
							<path d='M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z' />
						</svg>
					</Link>

					<button
						onClick={() => paginate(1)}
						className='button icon-right'
						disabled={isLoading || !chapterMeta?.nextPath}
					>
						<span>Next</span>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M0 0h24v24H0V0z' fill='none' />
							<path d='M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z' />
						</svg>
					</button>
				</div>
			</div>

			<Outlet
				context={{
					isLoading,
					content: chapterMeta?.images || [],
				}}
			/>

			<div className={styles.header}>
				<div className={styles.container}>
					<button
						onClick={() => paginate(-1)}
						className='button icon-left'
						disabled={isLoading || !chapterMeta?.prevPath}
					>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M0 0h24v24H0V0z' fill='none' />
							<path d='M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z' />
						</svg>
						<span>Prev</span>
					</button>
					<Link to='/mangas' className='button'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M0 0h24v24H0V0z' fill='none' />
							<path d='M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z' />
						</svg>
					</Link>

					<button
						onClick={() => paginate(1)}
						className='button icon-right'
						disabled={isLoading || !chapterMeta?.nextPath}
					>
						<span>Next</span>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M0 0h24v24H0V0z' fill='none' />
							<path d='M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z' />
						</svg>
					</button>
				</div>
			</div>
		</>
	);
}
