import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSWR from 'swr';
import NProgress from 'nprogress';

import { ProfileContext } from '../../contexts/ProfileContext';

import Head from '../../components/Head';
import Navbar from '../../components/navbars/watch';

import { fetcher } from '../../functions/fetchAPI.js';

import styles from './watch.module.css';

export default function Anime() {
	const params = useParams();
	const [{ currentProfile }] = useContext(ProfileContext);

	const { data: animeMeta } = useSWR(
		`/users/${currentProfile._id}/animes/${params.name}`,
		fetcher
	);

	const currentSeason = animeMeta?.seasons?.find(
		season => season.urlName === params.season
	);

	const { data: currentEpisode } = useSWR(
		() =>
			`/users/${currentProfile._id}/animes/${params.name}/${currentSeason.urlName}/${params.episodeUrlName}`,
		fetcher
	);

	const [prevEpisode, setPrevEpisode] = useState();
	const [nextEpisode, setNextEpisode] = useState();

	useEffect(() => {
		NProgress.start();
	}, [params]);

	useEffect(() => {
		if (currentSeason?.episodes) {
			const { episodes } = currentSeason;

			const curr = episodes.find(
				episode => episode.urlName === params.episodeUrlName
			);
			const index = episodes.indexOf(curr);
			const prev = episodes[index - 1];
			const next = episodes[index + 1];

			setPrevEpisode(prev);
			setNextEpisode(next);
		}
	}, [currentSeason, params.episodeUrlName]);

	return (
		<>
			<Head>
				<title>
					{currentEpisode ? 'Episode ' + currentEpisode?.number : ''}
				</title>
			</Head>

			<Navbar />

			<main className={styles.mainContainer}>
				<div className={styles.videoContainer}>
					<iframe
						src={currentEpisode?.iframeSrc}
						allowFullScreen={true}
						frameBorder='0'
						marginWidth='0'
						marginHeight='0'
						scrolling='no'
						title='video'
						onLoad={() => NProgress.done()}
					></iframe>
					{/* <div></div> */}
				</div>

				<div className={styles.paginationContainer}>
					{prevEpisode ? (
						<Link
							to={`/animes/${params.name}/${currentSeason.urlName}/${prevEpisode.urlName}`}
						>
							<i className='icon'>chevron_left</i> Episode {prevEpisode.number}
						</Link>
					) : (
						<div></div>
					)}
					{nextEpisode ? (
						<Link
							to={`/animes/${params.name}/${currentSeason.urlName}/${nextEpisode.urlName}`}
						>
							Episode {nextEpisode.number}
							<i className='icon'>chevron_right</i>
						</Link>
					) : (
						<div></div>
					)}
				</div>

				<div className={styles.titleContainer}>
					<h1>{animeMeta?.title}</h1>

					<div>
						<h3>
							{currentSeason?.name} - Episode {currentEpisode?.number}
						</h3>

						<div className={styles.buttonContainer}>
							<button className={styles.button} title='Add to your favourites'>
								<i className='icon'>favorite</i>
							</button>
							<button
								className={styles.button}
								title='Display in picture-in-picture mode'
							>
								<i className='icon'>picture_in_picture</i>
							</button>
							<button
								className={styles.button}
								title='Open source video'
								onClick={() =>
									window.open(currentEpisode?.originalUrl, '_blank')
								}
							>
								<i className='icon'>open_in_new</i>
							</button>
							<button className={styles.button} title='Share this video'>
								<i className='icon'>share</i>
							</button>
						</div>
					</div>
				</div>

				<div className={styles.episodes}>
					<p>Episodes</p>

					{currentSeason?.episodes?.map(episode => (
						<Link
							key={'EP ' + episode.number}
							to={`/animes/${params.name}/${currentSeason.urlName}/${episode.urlName}`}
							className={
								styles.episode +
								(currentEpisode?.number === episode.number
									? ' current'
									: episode.status != null
									? ' ' + episode.status
									: '')
							}
						>
							EP {episode.number}
						</Link>
					))}
				</div>
			</main>
		</>
	);
}
