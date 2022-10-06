import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSWRConfig } from 'swr';

import fetchAPI from '../../../functions/fetchAPI';
import useFormCreator from './../../../hooks/useFormCreator';
import { ProfileContext } from '../../../contexts/ProfileContext';

import Loader from '../../Loader';

import styles from './SearchTMDB.module.css';

export default function SearchTMDB({ closePopup, data: animeMeta }) {
	const params = useParams();
	const navigate = useNavigate();
	const { mutate } = useSWRConfig();
	const [{ currentProfile }] = useContext(ProfileContext);

	const [inputText, setInputText] = useState(animeMeta.title);
	const [isLoading, setIsLoading] = useState(false);
	const [items, setItems] = useState(null);

	const [currentPage, setCurrentPage] = useState(0);
	const [selectedItemIndex, setSelectedItemIndex] = useState(null);

	const [tmdbMeta, setTmdbMeta] = useState({});

	const [{ season: selectedSeasonId }, seasonSelectEl] = useFormCreator([
		{
			label: 'Season:',
			name: 'season',
			type: 'select',
			defaultValue: tmdbMeta?.seasons?.[0],
			options: tmdbMeta?.seasons?.map(season => ({
				value: season.id,
				displayName: season.name,
			})),
		},
	]);

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
		setTmdbMeta(res);
		setCurrentPage(1);
	};

	const addToLibrary = async () => {
		try {
			const res = await fetchAPI(`/users/${currentProfile._id}/animes`, {
				method: 'POST',
				body: JSON.stringify({
					from: 'customImport',
					gogoUrlName: animeMeta.urlName,
					title: tmdbMeta.name,
					description: tmdbMeta.overview,
					poster: {
						large: `https://image.tmdb.org/t/p/original${tmdbMeta.poster_path}`,
						small: `https://image.tmdb.org/t/p/w300${tmdbMeta.poster_path}`,
					},
					backdrop: {
						large: `https://image.tmdb.org/t/p/original${tmdbMeta.backdrop_path}`,
						small: `https://image.tmdb.org/t/p/w300${tmdbMeta.backdrop_path}`,
					},
					seasonId: Number(selectedSeasonId),
					tmdbId: tmdbMeta.id,
				}),
			});
			closePopup();
			if (params.name === res.urlName)
				mutate(`/users/${currentProfile._id}/animes/${params.name}`);
			navigate(`/animes/${res.urlName}`);
		} catch (err) {
			console.error(err);
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
									alt={item.name}
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

				{tmdbMeta && seasonSelectEl}
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
