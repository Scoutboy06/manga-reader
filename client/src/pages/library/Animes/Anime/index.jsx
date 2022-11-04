import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import NProgress from 'nprogress';
import useSWR from 'swr';

import { ProfileContext } from '../../../../contexts/ProfileContext';

import Navbar from '../../../../components/navbars/Anime';
import AddToLibraryButton from '../../../../components/AddToLibraryButton';
import MediaCard from './../../../../components/MediaCard/index';

import styles from './Anime.module.css';
import Image from './../../../../components/Image';

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
		NProgress.done();
	}, []);

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

							{currentSeason?.parts?.map(part => (
								<div className={styles.part}>
									{currentSeason.parts.length > 1 && (
										<h2 className={styles.partTitle}>Part {part.number}</h2>
									)}

									{part.episodes.map(episode => (
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
