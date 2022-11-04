import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSWR from 'swr';

import { ProfileContext } from '../../contexts/ProfileContext';

import Head from '../../components/Head';
import Navbar from '../../components/navbars/watch';

import styles from './watch.module.css';

export default function Anime() {
	const params = useParams();
	const [{ currentProfile }] = useContext(ProfileContext);

	const { data: animeMeta } = useSWR(
		`/users/${currentProfile._id}/animes/${params.name}`,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);

	const currentSeason = animeMeta?.seasons?.find(
		season => season.urlName === params.season
	);

	const { data: episodeMeta } = useSWR(
		() =>
			`/users/${currentProfile._id}/animes/${params.name}/${currentSeason.urlName}/${params.episodeUrlName}`
	);

	const [prevEpisode, setPrevEpisode] = useState(null);
	const [currentEpisode, setCurrentEpisode] = useState(null);
	const [nextEpisode, setNextEpisode] = useState(null);

	useEffect(() => {
		if (currentSeason?.parts) {
			parts: for (let i = 0; i < currentSeason.parts.length; i++) {
				const part = currentSeason.parts[i];
				// console.log(part.episodes.length);

				for (let j = 0; i < part.episodes.length; j++) {
					if (part.episodes[j]?.urlName === params.episodeUrlName) {
						setPrevEpisode(part.episodes[j - 1]);
						setCurrentEpisode(part.episodes[j]);
						setNextEpisode(part.episodes[j + 1]);
						break parts;
					}
				}
			}
		}
	}, [currentSeason, params.episodeUrlName]);

	return (
		<>
			<Head>
				<title>{'Episode ' + currentEpisode?.number || ''}</title>
			</Head>

			<Navbar />

			<main className={styles.mainContainer}>
				<div className={styles.videoContainer}>
					<iframe
						src={episodeMeta?.iframeSrc}
						allowFullScreen={true}
						frameBorder='0'
						marginWidth='0'
						marginHeight='0'
						scrolling='no'
						title='video'
					></iframe>
					{/* <div></div> */}
				</div>

				<div className={styles.paginationContainer}>
					{prevEpisode ? (
						<Link
							to={`/animes/${params.name}/${currentSeason?.urlName}/${prevEpisode.urlName}`}
						>
							<i className='icon'>chevron_left</i> Episode {prevEpisode.number}
						</Link>
					) : (
						<div></div>
					)}
					{nextEpisode ? (
						<Link
							to={`/animes/${params.name}/${currentSeason?.urlName}/${nextEpisode.urlName}`}
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
							<button className={styles.button} title='Toggle watch state'>
								<i
									className='icon'
									style={{
										color:
											currentEpisode?.watchStatus === 'completed'
												? '#c33'
												: '#fff',
									}}
								>
									check
								</i>
							</button>
							<button className={styles.button} title='Add to your favourites'>
								<i className='icon'>favorite</i>
							</button>
							<button
								className={styles.button}
								title='Open source video'
								onClick={() => window.open(episodeMeta?.originalUrl, '_blank')}
							>
								<i className='icon'>open_in_new</i>
							</button>
						</div>
					</div>
				</div>

				<div className={styles.episodes}>
					<p>Episodes</p>

					{currentSeason?.parts?.map(part => (
						<div className={styles.part} key={`part_${part.number}`}>
							{currentSeason.parts.length > 1 && (
								<h2 className={styles.partTitle}>Part {part.number}</h2>
							)}

							{part.episodes.map(episode => (
								<Link
									key={'EP_' + episode.number}
									to={`/animes/${params.name}/${currentSeason.urlName}/${episode.urlName}`}
									className={`${styles.episode} ${
										params.episodeUrlName === episode.urlName
											? 'current'
											: episode.status
									}`}
								>
									EP {episode.number}
								</Link>
							))}
						</div>
					))}
				</div>
			</main>
		</>
	);
}
