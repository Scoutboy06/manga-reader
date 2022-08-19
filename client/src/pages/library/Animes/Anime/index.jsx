import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import NProgress from 'nprogress';
import useSWR, { useSWRConfig } from 'swr';
import fetchAPI from '../../../../functions/fetchAPI';

import { ProfileContext } from '../../../../contexts/ProfileContext';

import Navbar from '../../../../components/navbars/Anime';

import styles from './Anime.module.css';

export default function Anime() {
	const [{ currentProfile }] = useContext(ProfileContext);
	const params = useParams();
	const { mutate } = useSWRConfig();

	const { data: animeMeta } = useSWR(
		() => `/users/${currentProfile._id}/animes/${params.name}`
	);
	const [nextEpisode, setNextEpisode] = useState();

	const addToLibrary = async () => {
		const res = await fetchAPI(`/users/${currentProfile._id}/animes`, {
			method: 'POST',
			body: JSON.stringify({ urlName: animeMeta.urlName }),
		});
		console.log(res);
		if (res.ok) {
			mutate(`/users/${currentProfile._id}/animes/${params.name}`);
		}
	};

	useEffect(() => {
		if (!animeMeta) {
			NProgress.start();
		} else {
			NProgress.done(true);
			const next = animeMeta.episodes.find(ep => ep.status === '');
			setNextEpisode(next);
		}
	}, [animeMeta]);

	if (!animeMeta) return null;

	return (
		<>
			<Navbar />

			<main className={styles.mainContainer}>
				<div className={styles.imageContainer}>
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<img src={animeMeta.imgUrl} />
				</div>

				<div className={styles.dataContainer}>
					<div className={styles.titleContainer}>
						<h1>{animeMeta.title}</h1>

						{animeMeta.from === 'db' ? (
							<div className={styles.buttonContainer}>
								<button className={styles.button}>
									<i className='icon'>play_arrow</i>
								</button>
								<button className={styles.button}>
									<i className='icon'>done</i>
								</button>
								<button className={styles.button}>
									<i className='icon'>notifications_active</i>
								</button>
								<button className={styles.button}>
									<i className='icon'>edit</i>
								</button>
								<button className={styles.button}>
									<i className='icon'>more_vert</i>
								</button>
							</div>
						) : (
							<button className={styles.addToLibraryBtn} onClick={addToLibrary}>
								Add to library
							</button>
						)}
					</div>

					<p className={styles.description}>{animeMeta.description}</p>

					<table className={styles.misc}>
						<tbody>
							<tr>
								<th>Genres</th>
								<th>{animeMeta.misc.genres}</th>
							</tr>
							<tr>
								<th>Released</th>
								<th>{animeMeta.misc.released}</th>
							</tr>
							<tr>
								<th>Status</th>
								<th>{animeMeta.misc.status}</th>
							</tr>
							<tr>
								<th>Other names</th>
								<th>{animeMeta.misc.otherNames}</th>
							</tr>
						</tbody>
					</table>

					{animeMeta.from === 'db' && nextEpisode && (
						<div className={styles.nextUp}>
							<p>Next up:</p>
							<Link
								to={`/animes/${params.name}/episode-${nextEpisode.number}`}
								className={styles.episode}
							>
								EP {nextEpisode.number}
							</Link>
						</div>
					)}

					<div className={styles.episodes}>
						<p>Episodes</p>

						{animeMeta.from === 'scrape' && (
							<div className={styles.overlay}>
								<h1>Add to your library to start watching</h1>
								<button
									className={styles.addToLibraryBtn}
									onClick={addToLibrary}
								>
									Add to library
								</button>
							</div>
						)}

						{animeMeta.episodes.map(episode => (
							<Link
								key={'EP ' + episode.number}
								to={`/animes/${params.name}/episode-${episode.number}`}
								className={
									styles.episode +
									(episode.status != null ? ' ' + episode.status : '')
								}
							>
								EP {episode.number}
							</Link>
						))}
					</div>
				</div>
			</main>
		</>
	);
}
