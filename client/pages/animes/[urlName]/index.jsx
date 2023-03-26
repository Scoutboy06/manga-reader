import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';

import { ProfileContext } from '@/contexts/ProfileContext';

import Navbar from '@/components/navbars/Library';
import MediaCard from '@/components/MediaCard/index';

import styles from './anime.module.css';
import Image from '@/components/Image';

export default function Anime() {
	const { query } = useRouter();

	const [{ currentProfile }] = useContext(ProfileContext);

	const { data: animeMeta } = useSWR(
		() => `/users/${currentProfile._id}/animes/${query.name}`,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
		}
	);
	const [nextEpisode, setNextEpisode] = useState();

	const isSeason = !!query.season;
	const isAnime = !query.season;

	const currentSeason = animeMeta?.seasons?.find(
		season => season.urlName === query.season
	);

	if (!animeMeta) return null;

	return (
		<>
			<Navbar />

			<main className={styles.mainContainer}>
				<div className={styles.imageContainer}>
					{isAnime ? (
						<Image
							src={animeMeta.poster.large}
							placeholder={animeMeta.poster.small}
						/>
					) : (
						<Image
							src={currentSeason.poster.large}
							placeholder={currentSeason.poster.small}
						/>
					)}
				</div>

				<div className={styles.dataContainer}>
					<div className={styles.titleContainer}>
						<div>
							<h1>{animeMeta.title}</h1>
							{isSeason && <p>{currentSeason.name}</p>}
						</div>

						{animeMeta.from === 'scrape' ? null : (
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
								href={`/animes/${query.name}/episode-${nextEpisode.number}`}
								className={styles.episode}
							>
								EP {nextEpisode.number}
							</Link>
						</div>
					)}

					{query.season || animeMeta.from === 'scrape' ? (
						<div className={styles.episodes}>
							<p>Episodes</p>

							{animeMeta.from === 'scrape' && (
								<div className={styles.overlay}>
									<h1>Add to your library to start watching</h1>
								</div>
							)}

							{currentSeason?.parts?.map(part => (
								<div className={styles.part}>
									{currentSeason.parts.length > 1 && (
										<h2 className={styles.partTitle}>Part {part.number}</h2>
									)}

									{part.episodes.map(episode => (
										<Link
											key={'EP ' + episode.number}
											href={`/animes/${query.name}/${currentSeason.urlName}/episode-${episode.number}`}
											className={[
												styles.episode,
												episode.hasWatched ? 'completed' : '',
												episode.isNew ? 'new' : '',
											].join(' ')}
										>
											EP {episode.number}
										</Link>
									))}
								</div>
							))}
						</div>
					) : (
						<div className={styles.seasons}>
							<p>Seasons</p>

							{animeMeta?.seasons?.map(season => (
								<MediaCard
									key={season.tmdbId}
									href={`/animes/${query.name}/${season.urlName}`}
									imgUrl={season.poster.small}
									title={season.name}
									type='series'
									seriesHref={`/animes/${query.name}/${season.urlName}`}
									hasUpdates={season.hasNewEpisodes}
									dropdownItems={[
										{
											content: 'Delete',
											icon: <i className='icon'>delete</i>,
											action: () => {
												// 	fetchAPI(
												// 		`/animes/${animeMeta._id}/seasons/${season._id}`,
												// 		{
												// 			method: 'DELETE',
												// 		}
												// 	);
												// 	mutate(`/animes/${animeMeta._id}`);
											},
										},
									]}
								/>
							))}
						</div>
					)}
				</div>

				<div className={styles.backdrop}>
					<Image
						src={animeMeta?.backdrop?.large}
						placeholder={animeMeta?.backdrop?.small}
						blur={3}
					/>
				</div>
			</main>
		</>
	);
}
