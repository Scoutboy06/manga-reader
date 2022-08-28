import { useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import fetchAPI from '../../../functions/fetchAPI';

import Loader from '../../Loader';

import { ProfileContext } from '../../../contexts/ProfileContext';

import styles from './SearchTMDB.module.css';

export default function SearchTMDB({ closePopup, data: animeMeta }) {
	const params = useParams();
	const { mutate } = useSWRConfig();
	const [{ currentProfile }] = useContext(ProfileContext);

	const [inputText, setInputText] = useState(animeMeta.title);
	const [isLoading, setIsLoading] = useState(false);
	const [items, setItems] = useState(null);

	const [currentPage, setCurrentPage] = useState(0);
	const [selectedItemIndex, setSelectedItemIndex] = useState(null);

	const meta = useRef();

	const [selectedSeasonId, setSelectedSeasonId] = useState('');
	const [seasons, setSeasons] = useState(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [largePosterUrl, setLargePosterUrl] = useState('');
	const [smallPosterUrl, setSmallPosterUrl] = useState('');
	const [largeBackdropUrl, setLargeBackdropUrl] = useState('');
	const [smallBackdropUrl, setSmallBackdropUrl] = useState('');

	const searchSubmit = async e => {
		e.preventDefault();
		setIsLoading(true);
		setItems(null);
		setSelectedItemIndex(null);

		const data = await fetchAPI(`/tmdb/search/tv?query=${inputText}`);

		setIsLoading(false);
		setItems(data.results);
	};

	const selectItem = async () => {
		const { id } = items[selectedItemIndex];

		const res = await fetchAPI(`/tmdb/tv/${id}`);
		meta.current = res;
		setCurrentPage(1);
		setSeasons(res.seasons);
		setSelectedSeasonId(null);
		setTitle(res.name);
		setDescription(res.overview);
		setLargePosterUrl(
			res.poster_path
				? `https://image.tmdb.org/t/p/original${res.poster_path}`
				: ''
		);
		setSmallPosterUrl(
			res.poster_path ? `https://image.tmdb.org/t/p/w300${res.poster_path}` : ''
		);
		setLargeBackdropUrl(
			res.backdrop_path
				? `https://image.tmdb.org/t/p/original${res.backdrop_path}`
				: ''
		);
		setSmallBackdropUrl(
			res.backdrop_path
				? `https://image.tmdb.org/t/p/w300${res.backdrop_path}`
				: ''
		);
	};

	const addToLibrary = async () => {
		console.log(selectedSeasonId);
		return;
		const res = await fetchAPI(`/users/${currentProfile._id}/animes`, {
			method: 'POST',
			body: JSON.stringify({
				from: 'customImport',
				gogoUrlName: animeMeta.urlName,
				title,
				description,
				poster: {
					large: largePosterUrl,
					small: smallPosterUrl,
				},
				backdrop: {
					large: largeBackdropUrl,
					small: smallBackdropUrl,
				},
				seasonId: selectedSeasonId,
				tmdbId: meta.current.id,
			}),
		});
		console.log(res);
		if (res.ok) {
			mutate(`/users/${currentProfile._id}/animes/${params.name}`);
		}
	};

	return (
		<div
			className={styles.container}
			style={{ transform: `translateX(${-50 * currentPage}%)` }}
		>
			<div className={styles.section} style={{ paddingTop: '20px' }}>
				<form onSubmit={searchSubmit} className={styles.inputContainer}>
					<input
						type='text'
						placeholder='Search on TMDB...'
						value={inputText}
						onChange={e => setInputText(e.target.value)}
						autoCapitalize='off'
						autoCorrect='off'
						className={styles.input}
					/>

					<button
						type='reset'
						className={`${styles.resetBtn} ${
							inputText.length === 0 ? 'hidden' : ''
						} icon`}
						onClick={() => setInputText('')}
					>
						close
					</button>

					<button type='submit' className={styles.submitBtn + ' icon'}>
						search
					</button>
				</form>

				{isLoading && (
					<Loader
						size={60}
						style={{
							position: 'absoulte',
							left: 'calc(50% - 30px)',
							top: '160px',
						}}
					/>
				)}

				{!isLoading &&
					items?.map((item, i) => (
						<div className={styles.itemContainer}>
							<button
								key={item.id}
								className={styles.item}
								onClick={() => setSelectedItemIndex(i)}
								data-selected={selectedItemIndex === i}
							>
								<img
									className={styles.poster}
									src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
									alt='Manga cover'
								/>
								<div className={styles.details}>
									<span>{item.name}</span>
									<span>{item.first_air_date}</span>
									<span>{item.overview}</span>
								</div>
							</button>

							<a
								className={styles.openSource + ' icon'}
								onClick={() =>
									window.open(
										`https://www.themoviedb.org/tv/${item.id}`,
										'_blank'
									)
								}
								href={item.detailsPage}
								target='_blank'
								rel='nofollow noreferrer noopener'
							>
								open_in_new
							</a>
						</div>
					))}

				{!isLoading && items?.length === 0 && (
					<h4 style={{ marginLeft: '5%' }}>No results...</h4>
				)}

				<button
					className={styles.nextBtn}
					style={{ bottom: selectedItemIndex !== null ? '1em' : '-5em' }}
					onClick={() => selectItem()}
				>
					Next <i className='icon'>chevron_right</i>
				</button>
			</div>

			<div className={styles.section} style={{ paddingBottom: '7em' }}>
				<button className={styles.backBtn} onClick={() => setCurrentPage(0)}>
					<i className='icon'>chevron_left</i> Back
				</button>

				{seasons && (
					<div className={styles.formGroup}>
						<label htmlFor='season'>Season:</label>
						<select
							name='season'
							id='season'
							value={selectedSeasonId}
							onChange={e => setSelectedSeasonId(e.target.value)}
						>
							{seasons.map(season => (
								<option value={season.id}>{season.name}</option>
							))}
						</select>
					</div>
				)}

				<div className={styles.formGroup}>
					<label htmlFor='title'>Title:</label>
					<input
						type='text'
						name='title'
						id='title'
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<button onClick={() => setTitle(animeMeta.title)}>
						Revert to original
					</button>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='description'>Description:</label>
					<textarea
						name='description'
						id='description'
						value={description}
						onChange={e => setDescription(e.target.value)}
					/>
					<button onClick={() => setDescription(animeMeta.description)}>
						Revert to original
					</button>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='largePosterUrl'>Large poster URL:</label>
					<input
						type='text'
						name='largePosterUrl'
						id='largePosterUrl'
						value={largePosterUrl}
						onChange={e => setLargePosterUrl(e.target.value)}
					/>
					<button onClick={() => setLargePosterUrl(animeMeta?.poster?.large)}>
						Revert to original
					</button>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='smallPosterUrl'>Small poster URL:</label>
					<input
						type='text'
						name='smallPosterUrl'
						id='smallPosterUrl'
						value={smallPosterUrl}
						onChange={e => setSmallPosterUrl(e.target.value)}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='largeBackdropUrl'>Large backdrop URL:</label>
					<input
						type='text'
						name='largeBackdropUrl'
						id='largeBackdropUrl'
						value={largeBackdropUrl}
						onChange={e => setLargeBackdropUrl(e.target.value)}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='smallBackdropUrl'>Small backdrop URL:</label>
					<input
						type='text'
						name='smallBackdropUrl'
						id='smallBackdropUrl'
						value={smallBackdropUrl}
						onChange={e => setSmallBackdropUrl(e.target.value)}
					/>
				</div>
			</div>

			<footer className={styles.footer}>
				<button type='reset' onClick={closePopup}>
					Cancel
				</button>
				<button type='submit' onClick={addToLibrary}>
					Add to library
				</button>
			</footer>
		</div>
	);
}
