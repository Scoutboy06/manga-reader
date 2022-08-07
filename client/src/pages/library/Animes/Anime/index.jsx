import { useNavigate, Link } from 'react-router-dom';

import styles from './Anime.module.css';

const data = {
	type: 'folder',
	urlName: 'mushoku-tensei-isekai-ittara-honki-dasu',
	imgUrl:
		'https://gogocdn.net/cover/mushoku-tensei-isekai-ittara-honki-dasu.png',
	title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
	description:
		'Killed while saving a stranger from a traffic collision, a 34-year-old NEET is reincarnated into a world of magic as Rudeus Greyrat, a newborn baby. With knowledge, experience, and regrets from his previous life retained, Rudeus vows to lead a fulfilling life and not repeat his past mistakes. Now gifted with a tremendous amount of magical power as well as the mind of a grown adult, Rudeus is seen as a genius in the making by his new parents. Soon, he finds himself studying under powerful warriors, such as his swordsman father and a mage named Roxy Migurdia—all in order to hone his apparent talents. But despite his innocent exterior, Rudeus is still a perverted otaku, who uses his wealth of knowledge to make moves on women whom he could never make in his previous life.',
	miscData: {
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
			url: 'episode-1',
			status: 'completed',
		},
		{
			number: 2,
			url: 'episode-2',
			status: 'completed',
		},
		{
			number: 3,
			url: 'episode-3',
			status: 'completed',
		},
		{
			number: 4,
			url: 'episode-4',
			status: null,
		},
		{
			number: 5,
			url: 'episode-5',
			status: null,
		},
		{
			number: 6,
			url: 'episode-6',
			status: null,
		},
		{
			number: 7,
			url: 'episode-7',
			status: null,
		},
		{
			number: 8,
			url: 'episode-8',
			status: null,
		},
		{
			number: 9,
			url: 'episode-9',
			status: null,
		},
		{
			number: 10,
			url: 'episode-10',
			status: null,
		},
		{
			number: 11,
			url: 'episode-11',
			status: null,
		},
	],
};

export default function Anime() {
	const navigate = useNavigate();

	const nextEpisode = data.episodes.find(episode => episode.status === null);

	return (
		<>
			<nav className={styles.navbar}>
				<div className={styles.buttonContainer} style={{ height: '100%' }}>
					<button className={styles.button} onClick={() => navigate(-1)}>
						<i className='icon' style={{ fontSize: 28 }}>
							chevron_left
						</i>
					</button>
					<button className={styles.button} onClick={() => navigate('/animes')}>
						<i className='icon filled'>home</i>
					</button>
				</div>
			</nav>

			<main className={styles.mainContainer}>
				<div className={styles.imageContainer}>
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<img src={data.imgUrl} />
				</div>

				<div className={styles.dataContainer}>
					<div className={styles.titleContainer}>
						<h1>{data.title}</h1>

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

					<p className={styles.description}>{data.description}</p>

					<table className={styles.miscData}>
						<tbody>
							{Object.keys(data.miscData).map((key, i) => (
								<tr key={key}>
									<th>{key}</th>
									<th>{data.miscData[key]}</th>
								</tr>
							))}
						</tbody>
					</table>

					{nextEpisode && (
						<div className={styles.nextUp}>
							<p>Next up:</p>
							<Link
								to={`/watch/${data.urlName}/${nextEpisode.url}`}
								className={styles.episode}
							>
								EP {nextEpisode.number}
							</Link>
						</div>
					)}

					<div className={styles.episodes}>
						<p>Episodes</p>

						{data.episodes.map(episode => (
							<Link
								key={'EP ' + episode.number}
								to={`/watch/${data.urlName}/${episode.url}`}
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
