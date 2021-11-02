import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Loader from '../../components/Loader';

import styles from './index.module.css';



function Header({ chapters: { prev, curr, next }, isLoading, originalUrl, isTop }) {
	return (
		<header className={styles.header}>
			{ isTop && (
				<h2 className={styles.title}>{ curr }</h2>
			)}

			{ isTop && (
				<div className={styles.container} style={{ marginBottom: 30 }}>
					<a
						href={originalUrl}
						target="_blank"
						rel="nofollow noreferrer noopener"
						className={styles.pagination}
						disabled={isLoading || !originalUrl}
					>
						<img src="/icons/open_in_new_white_24dp.svg" alt="Open original" />
					</a>
				</div>
			)}

			<div className={styles.container}>

				<Link to={prev || '#'} className={styles.pagination} disabled={isLoading || !prev}>
					<img src="/icons/arrow_back-white-24dp.svg" alt="<-" />
					<span>Prev</span>
				</Link>

				<Link to="/" className={styles.pagination}>
					<img src="/icons/home-white-24dp.svg" alt="Home" />
				</Link>

				<Link to={next || '#'} className={styles.pagination} disabled={isLoading || !next}>
					<span>Next</span>
					<img src="/icons/arrow_forward-white-24dp.svg" alt="->" />
				</Link>

			</div>
		</header>
	)
}




export default function Read({ match, location }) {

	const [ chapters, setChapters ] = useState({
		prev: null,
		curr: match.params.chapter,
		next: null,
	});
	const [ images, setImages ] = useState([]);
	const [ originalUrl, setOriginalUrl ] = useState();
	const [ isLoading, setIsLoading ] = useState(false);


	const fetchChapters = () =>
		fetch(process.env.REACT_APP_API_URI + `api/manga/${match.params.mangaName}/${match.params.chapter}`)
		.then(res => res.json())
		.catch(console.error);


	const updateProgress = () =>
		fetch(process.env.REACT_APP_API_URI + `api/manga/updateProgress`, {
			method: 'POST',
			body: JSON.stringify({ urlName: match.params.mangaName, chapter: match.params.chapter }),
			headers: { 'Content-Type': 'application/json' },
		}).catch(console.error);

	function keyPress(e) {
		console.log(e);
	}



	useEffect(() => {
		(async function() {
			setIsLoading(true);

			const chaps = await fetchChapters();
			setChapters({
				prev: chaps.prevPath,
				curr: match.params.chapter,
				next: chaps.nextPath,
			});
			setImages(chaps.images);
			setOriginalUrl(chaps.originalUrl);
			console.log(chaps, chapters);

			setIsLoading(false);

			updateProgress()
		})();


		


		window.addEventListener('keypress', keyPress);

		return () => {
			window.removeEventListener('keypress', keyPress);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match.params]);



	return (
		<main className={styles.main}>
			<Header
				isTop={true}
				chapters={chapters}
				originalUrl={originalUrl}
			/>

			{ isLoading && (
				<div style={{ height: 100, marginTop: 30, marginBottom: 30 }}>
					<Loader size={100} style={{ left: 'calc(50% - 50px)' }} />
				</div>
			)}

			{ !isLoading && (
				<section className={styles.chapters}>
					{ images.map((image, index) => (
						<img src={image} key={index} alt="Failed to load" />	
					))}
				</section>
			)}

			<Header
				chapters={chapters}
			/>
		</main>
	)
}