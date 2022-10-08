import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import useSWRImmutable from 'swr/immutable';
import { useNavigate, useParams, Outlet } from 'react-router-dom';

import fetchAPI from '../../functions/fetchAPI';

import Select from '../../components/Select';

import { ProfileContext } from '../../contexts/ProfileContext';
import { SettingsContext } from '../../contexts/SettingsContext';

import styles from './read.module.css';

export default function Read() {
	const params = useParams();
	const navigate = useNavigate();

	const [{ currentProfile }] = useContext(ProfileContext);
	const [{ contentWidth }, { setContentWidth }] = useContext(SettingsContext);

	const { data: metadata } = useSWRImmutable(
		() => `/users/${currentProfile._id}/mangas/${params.name}`
	);

	const { data: chapterMeta } = useSWRImmutable(
		() => `/mangas/${metadata._id}/${params.chapter}`
	);

	const isLoading = !chapterMeta || !metadata;

	const [currentChapter, setCurrentChapter] = useState(null);
	const [nextChapter, setNextChapter] = useState(null);
	const [prevChapter, setPrevChapter] = useState(null);

	const paginate = dir => {
		window.scrollTo(0, 0);
		const { chapters } = metadata;

		if (dir === -1) {
			navigate(`/mangas/${metadata.urlName}/${prevChapter.urlName}`);
		} else if (dir === 1) {
			navigate(`/mangas/${metadata.urlName}/${nextChapter.urlName}`);
		}

		const newChapterIndex =
			chapters.findIndex(chapter => chapter.urlName === params.chapter) + dir;
		setNextChapter(chapters[newChapterIndex + 1]);
		setPrevChapter(chapters[newChapterIndex - 1]);
	};

	// Load new chapter
	useEffect(() => {
		if (!metadata) return;

		if (!params.chapter) {
			navigate(`/mangas/${metadata.urlName}/${metadata.currentChapter}`, {
				replace: true,
			});
		}

		const { chapters } = metadata;
		const currentChapterIndex = chapters.findIndex(
			chapter => chapter.urlName === params.chapter
		);
		setPrevChapter(chapters[currentChapterIndex - 1]);
		setCurrentChapter(chapters[currentChapterIndex]);
		setNextChapter(chapters[currentChapterIndex + 1]);

		// Sync chapter with server
		fetchAPI(`/mangas/${metadata._id}/currentChapter`, {
			method: 'POST',
			body: JSON.stringify({ currentChapter: params.chapter }),
		});
	}, [metadata, navigate, params]);

	return (
		<>
			<div className={styles.header}>
				<div style={{ marginBottom: 10 }}>
					<Select
						onChange={chapterUrlName =>
							navigate(`/mangas/${params.name}/${chapterUrlName}`)
						}
						value={params.chapter}
						containerText={
							<h1 className={styles.title}>{currentChapter?.title}</h1>
						}
						placement='bl'
					>
						{metadata?.chapters?.reverse()?.map(chapter => (
							<option value={chapter.urlName} key={chapter.urlName}>
								{chapter.title}
							</option>
						))}
					</Select>
				</div>

				<div className={styles.container} style={{ marginBottom: 30 }}>
					<a
						href={chapterMeta?.originalUrl}
						target='_blank'
						rel='nofollow noreferrer noopener'
						className={styles.button}
						disabled={isLoading || !chapterMeta?.originalUrl}
					>
						<i className='icon'>open_in_new</i>
					</a>

					<Select
						defaultValue={contentWidth}
						onChange={value => {
							setContentWidth(value === 'pageWidth' ? 'pageWidth' : value);
						}}
						containerText={
							contentWidth === 'pageWidth'
								? 'Page width'
								: `${contentWidth * 100}%`
						}
						placement='br'
					>
						<option value='pageWidth'>Page width</option>
						<hr />
						<option value={0.5}>50%</option>
						<option value={0.75}>75%</option>
						<option value={0.9}>90%</option>
						<option value={1.0}>100%</option>
						<option value={1.25}>125%</option>
						<option value={1.5}>150%</option>
						<option value={2.0}>200%</option>
					</Select>
				</div>

				<div className={styles.container}>
					<button
						onClick={() => paginate(-1)}
						className={styles.button + ' icon-left'}
						disabled={isLoading || !prevChapter}
					>
						<i className='icon'>arrow_back</i>
						Prev
					</button>

					<Link to='/mangas' className={styles.button}>
						<i className='icon'>home</i>
					</Link>

					<button
						onClick={() => paginate(1)}
						className={styles.button + ' icon-right'}
						disabled={isLoading || !nextChapter}
					>
						Next
						<i className='icon'>arrow_forward</i>
					</button>
				</div>
			</div>

			<Outlet
				context={{
					isLoading,
					chapterMeta: chapterMeta,
					currentChapter,
					prevChapter,
					nextChapter,
				}}
			/>

			<div className={styles.header}>
				<div className={styles.container}>
					<button
						onClick={() => paginate(-1)}
						className={styles.button + ' icon-left'}
						disabled={isLoading || !prevChapter}
					>
						<i className='icon'>arrow_back</i>
						Prev
					</button>

					<Link to='/mangas' className={styles.button}>
						<i className='icon'>home</i>
					</Link>

					<button
						onClick={() => paginate(1)}
						className={styles.button + ' icon-right'}
						disabled={isLoading || !nextChapter}
					>
						Next
						<i className='icon'>arrow_forward</i>
					</button>
				</div>
			</div>
		</>
	);
}
