import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import fetchAPI from '@/functions/fetchAPI';
import Head from 'next/head';

import { ProfileContext } from '@/contexts/ProfileContext';

import Navbar from '@/components/navbars/Library';

import styles from './watch.module.css';

export default function Anime() {
	const { query } = useRouter();
	const [{ currentProfile }] = useContext(ProfileContext);
	const { mutate } = useSWRConfig();

	const { data: animeMeta } = useSWR(
		() => `/users/${currentProfile._id}/animes/${query.urlName}`,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);

	const currentSeason = animeMeta?.seasons?.find(
		season => season.urlName === query.season
	);

	const { data: episodeMeta } = useSWR(
		() =>
			`/users/${currentProfile._id}/animes/${query.name}/${currentSeason.urlName}/${query.episodeUrlName}`,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);

	const [prevEpisode, setPrevEpisode] = useState(null);
	const [currentEpisode, setCurrentEpisode] = useState(null);
	const [nextEpisode, setNextEpisode] = useState(null);

	useEffect(() => {
		if (currentSeason?.parts) {
			parts: for (let i = 0; i < currentSeason.parts.length; i++) {
				const part = currentSeason.parts[i];
				// console.log(part.episodes.length);

				for (let j = 0; j < part.episodes.length; j++) {
					if (
						part.episodes[j]?.urlName === query.episodeUrlName &&
						currentSeason.urlName === query.season
					) {
						setPrevEpisode(part.episodes[j - 1]);
						setCurrentEpisode(part.episodes[j]);
						setNextEpisode(part.episodes[j + 1]);
						break parts;
					}
				}
			}
		}
	}, [currentSeason, query.episodeUrlName]);

	useEffect(() => {
		if (!episodeMeta) return;

		const animeUrl = `/users/${currentProfile._id}/animes/${query.name}`;
		const episodeUrl = `/users/${currentProfile._id}/animes/${query.name}/${currentSeason.urlName}/${query.episodeUrlName}`;

		// Update current episode in anime's cache
		mutate(
			animeUrl,
			anime => {
				let animeHasNewEpisodes = false;
				let hasWatchedAllAnimeEpisodes = true;

				for (const season of anime.seasons) {
					let seasonHasNewEpisodes = false;
					let hasWatchedAllSeasonEpisodes = true;

					for (const part of season.parts) {
						for (const episode of part.episodes) {
							// If it's the episode we're looking for
							if (episode.urlName === query.episodeUrlName) {
								episode.hasWatched = true;
								episode.isNew = false;
							}

							if (episode.isNew) {
								animeHasNewEpisodes = true;
								seasonHasNewEpisodes = true;
							}

							if (!episode.hasWatched) {
								hasWatchedAllAnimeEpisodes = false;
								hasWatchedAllSeasonEpisodes = false;
							}
						}
					}

					season.hasWatched = hasWatchedAllSeasonEpisodes;
					season.hasNewEpisodes = seasonHasNewEpisodes;
				}

				anime.hasNewEpisodes = animeHasNewEpisodes;
				anime.hasWatched = hasWatchedAllAnimeEpisodes;

				return anime;
			},
			{ revalidate: false }
		);

		// Update current episode
		mutate(
			episodeUrl,
			async episode => {
				console.log(episode);
				fetchAPI(episodeUrl, {
					method: 'PATCH',
					body: JSON.stringify({
						hasWatched: true,
					}),
				});

				episode.hasWatched = true;
				episode.isNew = false;
				return episode;
			},
			{ revalidate: false }
		);
	}, [episodeMeta]);

	return (
		<>
			<Head>
				<title>{'Episode ' + currentEpisode?.number || ''}</title>
			</Head>

			<Navbar />

			<main className={styles.mainContainer}>
				<div className={styles.videoContainer}>
					{/* <iframe
						src={episodeMeta?.iframeSrc}
						allowFullScreen={true}
						frameBorder='0'
						marginWidth='0'
						marginHeight='0'
						scrolling='no'
						title='video'
					></iframe> */}
					<div></div>
				</div>

				<div className={styles.paginationContainer}>
					{prevEpisode ? (
						<Link
							to={`/animes/${query.name}/${currentSeason?.urlName}/${prevEpisode.urlName}`}
						>
							<i className='icon'>chevron_left</i> Episode {prevEpisode.number}
						</Link>
					) : (
						<div></div>
					)}
					{nextEpisode ? (
						<Link
							to={`/animes/${query.name}/${currentSeason?.urlName}/${nextEpisode.urlName}`}
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
									to={`/animes/${query.name}/${currentSeason.urlName}/${episode.urlName}`}
									className={[
										styles.episode,
										currentEpisode?._id === episode._id
											? 'current'
											: episode.hasWatched
											? 'completed'
											: '',
									].join(' ')}
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
