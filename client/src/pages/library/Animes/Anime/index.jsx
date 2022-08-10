import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NProgress from 'nprogress';

import fetchAPI from '../../../../functions/fetchAPI.js';

import styles from './Anime.module.css';

const data = {
	type: 'folder',
	urlName: 'mushoku-tensei-isekai-ittara-honki-dasu',
	imgUrl:
		'https://gogocdn.net/cover/mushoku-tensei-isekai-ittara-honki-dasu.png',
	title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
	description:
		'Killed while saving a stranger from a traffic collision, a 34-year-old NEET is reincarnated into a world of magic as Rudeus Greyrat, a newborn baby. With knowledge, experience, and regrets from his previous life retained, Rudeus vows to lead a fulfilling life and not repeat his past mistakes. Now gifted with a tremendous amount of magical power as well as the mind of a grown adult, Rudeus is seen as a genius in the making by his new parents. Soon, he finds himself studying under powerful warriors, such as his swordsman father and a mage named Roxy Migurdia—all in order to hone his apparent talents. But despite his innocent exterior, Rudeus is still a perverted otaku, who uses his wealth of knowledge to make moves on women whom he could never make in his previous life.',
	miscanimeMeta: {
		Genres: ['Drama', 'Fantasy', 'Magic'].join(', '),
		Released: '2021',
		Status: 'Completed',
		'Other names': [
			'Mushoku Tensei: Jobless Reincarnation',
			'無職転生 ～異世界行ったら本気だす～',
		].join(', '),
	},
	episodes: [
		{
			number: 1,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-1',
			status: 'completed',
		},
		{
			number: 2,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-2',
			status: 'completed',
		},
		{
			number: 3,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-3',
			status: 'completed',
		},
		{
			number: 4,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-4',
			status: null,
		},
		{
			number: 5,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-5',
			status: null,
		},
		{
			number: 6,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-6',
			status: null,
		},
		{
			number: 7,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-7',
			status: null,
		},
		{
			number: 8,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-8',
			status: null,
		},
		{
			number: 9,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-9',
			status: null,
		},
		{
			number: 10,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-10',
			status: null,
		},
		{
			number: 11,
			url: 'mushoku-tensei-isekai-ittara-honki-dasu-episode-11',
			status: null,
		},
	],
};

export default function Anime() {
	const params = useParams();
	const navigate = useNavigate();

	const [animeMeta, setAnimeMeta] = useState();
	const [nextEpisode, setNextEpisode] = useState();

	useEffect(() => {
		async function fetchMeta() {
			const meta = await fetchAPI(`/animes/${params.name}`);
			const next = meta.episodes.find(episode => episode.status === null);

			setAnimeMeta(meta);
			setNextEpisode(next);

			NProgress.done(false);
		}

		fetchMeta();
	}, [params]);

	if (!animeMeta) return null;

	return (
		<>
			<nav className={styles.navbar}>
				<div className={styles.buttonContainer}>
					<Link to={'/animes'} className={styles.button}>
						<i className='icon' style={{ fontSize: 28 }}>
							chevron_left
						</i>
					</Link>
					<Link to='/animes' className={styles.button}>
						<i className='icon'>home</i>
					</Link>
					<button className={styles.button}>
						<i className='icon'>search</i>
					</button>
				</div>
			</nav>

			<main className={styles.mainContainer}>
				<div className={styles.imageContainer}>
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<img src={animeMeta.imgUrl} />
				</div>

				<div className={styles.dataContainer}>
					<div className={styles.titleContainer}>
						<h1>{animeMeta.title}</h1>

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

					{nextEpisode && (
						<div className={styles.nextUp}>
							<p>Next up:</p>
							<Link
								to={`/animes/${nextEpisode.url}`}
								className={styles.episode}
							>
								EP {nextEpisode.number}
							</Link>
						</div>
					)}

					<div className={styles.episodes}>
						<p>Episodes</p>

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
