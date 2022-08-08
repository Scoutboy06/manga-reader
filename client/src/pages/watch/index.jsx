import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import Head from '../../components/Head';

import styles from './watch.module.css';

const data = {
	urlName: 'mushoku-tensei-isekai-ittara-honki-dasu',
	title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
	gogoId: 'MTUwMjU4',
	episodes: [
		{
			number: 1,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-1',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-1',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: 'completed',
		},
		{
			number: 2,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-2',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-2',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: 'completed',
		},
		{
			number: 3,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-3',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-3',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: 'completed',
		},
		{
			number: 4,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-4',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-4',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: null,
		},
		{
			number: 5,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-5',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-5',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: null,
		},
		{
			number: 6,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-6',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-6',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: null,
		},
		{
			number: 7,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-7',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-7',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: null,
		},
		{
			number: 8,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-8',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-8',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: null,
		},
		{
			number: 9,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-9',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-9',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: null,
		},
		{
			number: 10,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-10',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-10',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: null,
		},
		{
			number: 11,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-11',
			originalUrl:
				'https://gogoanime.gg/mushoku-tensei-isekai-ittara-honki-dasu-episode-11',
			videoUrl: 'https://goload.io/streaming.php?id=MTUwMjU4',
			status: null,
		},
	],
};

export default function Anime() {
	const navigate = useNavigate();
	const params = useParams();

	const [currentEpisode, setCurrentEpisode] = useState();
	const [prevEpisode, setPrevEpisode] = useState();
	const [nextEpisode, setNextEpisode] = useState();

	useEffect(() => {
		const curr = data.episodes.find(
			episode => episode.url === params.episodeName
		);
		const prev = data.episodes[data.episodes.indexOf(curr) - 1];
		const next = data.episodes[data.episodes.indexOf(curr) + 1];

		setCurrentEpisode(curr);
		setPrevEpisode(prev);
		setNextEpisode(next);
	}, [params]);

	if (!currentEpisode) return 'Loading...';

	return (
		<>
			<Head>
				<title>{'Episode ' + currentEpisode.number}</title>
			</Head>

			<nav className={styles.navbar}>
				<div className={styles.buttonContainer} style={{ height: '100%' }}>
					<button className={styles.button} onClick={() => navigate(-1)}>
						<i className='icon' style={{ fontSize: 28 }}>
							chevron_left
						</i>
					</button>
					<button className={styles.button} onClick={() => navigate('/animes')}>
						<i className='icon'>home</i>
					</button>
					<button className={styles.button}>
						<i className='icon'>search</i>
					</button>
				</div>
				<div className={styles.buttonContainer} style={{ height: '100%' }}>
					<button className={styles.button}>
						<i className='icon'>cast</i>
					</button>
					<button className={styles.button}>
						<i className='icon'>airplay</i>
					</button>
				</div>
			</nav>

			<main className={styles.mainContainer}>
				<div className={styles.videoContainer}>
					<iframe
						src={currentEpisode.videoUrl}
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
						<Link to={'/watch/' + prevEpisode.url}>
							<i className='icon'>chevron_left</i> Episode {prevEpisode.number}
						</Link>
					) : (
						<div></div>
					)}
					{nextEpisode ? (
						<Link to={'/watch/' + nextEpisode.url}>
							Episode {nextEpisode.number}
							<i className='icon'>chevron_right</i>
						</Link>
					) : (
						<div></div>
					)}
				</div>

				<div className={styles.titleContainer}>
					<h1>{data.title}</h1>

					<div>
						<h3>Episode {currentEpisode.number}</h3>

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
							<button className={styles.button} title='Open source video'>
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

					{data.episodes.map(episode => (
						<Link
							key={'EP ' + episode.number}
							to={`/watch/${episode.url}`}
							className={
								styles.episode +
								(currentEpisode.number === episode.number
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
