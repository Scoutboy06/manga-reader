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

	const [nextChapter, setNextChapter] = useState(null);
	const [prevChapter, setPrevChapter] = useState(null);

	const hasInit = useRef(false);

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

	// Init
	useEffect(() => {
		async function init() {
			hasInit.current = true;
			setIsLoading(true);

			const meta = await fetchAPI(
				`/users/${profileData.currentProfile._id}/mangas/${params.name}`
			);

			setMetadata(meta);

			if (!params.chapter) {
				navigate(`/mangas/${params.name}/${meta.currentChapter}`, {
					replace: true,
				});
			}

			const currentChapterIndex = meta.chapters.findIndex(
				chapter => chapter.urlName === meta.currentChapter
			);
			console.log(
				meta.chapters[currentChapterIndex + 1],
				meta.chapters[currentChapterIndex - 1]
			);
			setNextChapter(meta.chapters[currentChapterIndex + 1]);
			setPrevChapter(meta.chapters[currentChapterIndex - 1]);

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
			fetchAPI(`/mangas/${metadata._id}/currentChapter`, {
				method: 'POST',
				body: JSON.stringify({ currentChapter: params.chapter }),
			});
		}

		if (metadata) loadChapter();
	}, [metadata, params]);

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>{chapterMeta?.title}</h2>
				<div style={{ marginBottom: 10 }}>
					{/* <Select onChange={console.log} className={styles.chapterSelect}>
						{metadata?.chapters?.reverse()?.map(chapter => (
							<option value={chapter.urlName} key={chapter.urlName}>
								{chapter.title}
							</option>
						))}
					</Select> */}
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
					chapterMeta,
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
