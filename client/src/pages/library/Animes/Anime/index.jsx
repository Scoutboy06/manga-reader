import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import NProgress from 'nprogress';
import useSWR from 'swr';
import fetchAPI from '../../../../functions/fetchAPI';

import { ProfileContext } from '../../../../contexts/ProfileContext';

import Navbar from '../../../../components/navbars/Anime';
import AddToLibraryButton from '../../../../components/AddToLibraryButton';
import MediaCard from './../../../../components/MediaCard/index';

import styles from './Anime.module.css';

export default function Anime() {
	const params = useParams();
	const [{ currentProfile }] = useContext(ProfileContext);

	const { data: animeMeta } = useSWR(
		() => `/users/${currentProfile._id}/animes/${params.name}`,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
		}
	);
	const [nextEpisode, setNextEpisode] = useState();

	const isSeason = !!params.season;
	const isAnime = !params.season;

	const currentSeason = animeMeta?.seasons?.find(
		season => season.urlName === params.season
	);

	useEffect(() => {
		NProgress.done(true);

		// if(!animeMeta?.seasons)

		// if (!animeMeta?.episodes) {
		// 	NProgress.start();
		// } else {
		// 	NProgress.done(true);
		// 	const next = animeMeta.episodes.find(ep => ep.status === '');
		// 	setNextEpisode(next);
		// }
	}, [animeMeta]);

	useEffect(() => {
		NProgress.done(true);
	}, [params]);

	if (!animeMeta) return null;

	return (
		<>
			<Navbar />

			<main className={styles.mainContainer}>
				<div className={styles.imageContainer}>
					{isAnime ? (
						<img src={animeMeta.poster.large} alt={animeMeta.title} />
					) : (
						<img src={currentSeason.poster.large} alt={currentSeason.name} />
					)}
				</div>

				<div className={styles.dataContainer}>
					<div className={styles.titleContainer}>
						<div>
							<h1>{animeMeta.title}</h1>
							{isSeason && <p>{currentSeason.name}</p>}
						</div>

						{animeMeta.from === 'scrape' ? (
							<AddToLibraryButton animeMeta={animeMeta} />
						) : (
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
						)}
					</div>

					<p className={styles.description}>
						{isAnime ? animeMeta.description : currentSeason.description}
					</p>

					{isAnime && (
						<table className={styles.misc}>
							<tbody>
								<tr>
									<th>Genres</th>
									<th>{animeMeta.genres}</th>
								</tr>
								<tr>
									<th>Released</th>
									<th>{animeMeta.released}</th>
								</tr>
								<tr>
									<th>Status</th>
									<th>{animeMeta.status}</th>
								</tr>
								<tr>
									<th>Other names</th>
									<th>{animeMeta.otherNames}</th>
								</tr>
							</tbody>
						</table>
					)}

					{isAnime && animeMeta.from === 'db' && nextEpisode && (
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

					{params.season || animeMeta.from === 'scrape' ? (
						<div className={styles.episodes}>
							<p>Episodes</p>

							{animeMeta.from === 'scrape' && (
								<div className={styles.overlay}>
									<h1>Add to your library to start watching</h1>
									<AddToLibraryButton animeMeta={animeMeta} />
								</div>
							)}

							{currentSeason?.episodes?.map(episode => (
								<Link
									key={'EP ' + episode.number}
									to={`/animes/${params.name}/${currentSeason.urlName}/episode-${episode.number}`}
									className={
										styles.episode +
										(episode.status != null ? ' ' + episode.status : '')
									}
								>
									EP {episode.number}
								</Link>
							))}
						</div>
					) : (
						<div className={styles.seasons}>
							<p>Seasons</p>

							{animeMeta?.seasons?.map(season => (
								<MediaCard
									href={`/animes/${params.name}/${season.urlName}`}
									imgUrl={season.poster.small}
									title={season.name}
									type='series'
									seriesHref={`/animes/${params.name}/${season.urlName}`}
								/>
							))}
						</div>
					)}
				</div>

				<div className={styles.backdrop}>
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<img src={animeMeta?.backdrop?.large} />
				</div>
			</main>
		</>
	);
}
