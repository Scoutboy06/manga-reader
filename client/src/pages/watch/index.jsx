import { useNavigate, useParams } from 'react-router-dom';

import Head from '../../components/Head';

import styles from './watch.module.css';

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
	const params = useParams();

	return (
		<>
			<Head>
				<title>{'Episode ' + params.episodeName.split('-')[1]}</title>
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
				</div>
			</nav>

			<main>
				<div className={styles.videoContainer}>
					<iframe
						src='https://goload.io/streaming.php?id=MTUwMjU4&title=Mushoku+Tensei%3A+Isekai+Ittara+Honki+Dasu+Episode+1&typesub=SUB'
						allowFullScreen={true}
						frameBorder='0'
						marginWidth='0'
						marginHeight='0'
						scrolling='no'
						title='video'
					></iframe>
					{/* <div></div> */}
				</div>
			</main>
		</>
	);
}
