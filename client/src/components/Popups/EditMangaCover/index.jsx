import { useState, useEffect } from 'react';

import fetchAPI from '../../../functions/fetchAPI.js';

import styles from './EditMangaCover.module.css';

export default function EditMangaCover({ closePopup, data: manga }) {
	const [coverUrl, setCoverUrl] = useState(
		manga.coverUrl.startsWith('/api/image/')
			? manga.coverUrl.slice(11)
			: manga.coverUrl
	);
	const [renderedUrl, setRenderedUrl] = useState(manga.coverUrl);

	const [imageSize, setImageSize] = useState({
		source: null,
		rendered: null,
	});
	const [useProxy, setUseProxy] = useState(
		manga.coverUrl.startsWith('/api/image/')
	);

	const submitHandler = () => {
		fetchAPI(`/mangas/${manga._id}`, {
			method: 'PATCH',
			body: JSON.stringify({ coverUrl: renderedUrl }),
		}).then(() => window.location.reload());
	};

	const imageLoadedHandler = e => {
		setImageSize({
			source: e.target.naturalWidth + 'x' + e.target.naturalHeight,
			rendered: e.target.width + 'x' + e.target.height,
		});
	};

	useEffect(() => {
		if (useProxy) setRenderedUrl('/api/image/' + coverUrl);
		else setRenderedUrl(coverUrl);
	}, [coverUrl, useProxy]);

	return (
		<div className={styles.container}>
			<main className={styles.main}>
				<div className={styles.formGroup}>
					<label htmlFor='coverUrl'>Cover URI:</label>
					<input
						type='text'
						name='coverUrl'
						id='coverUrl'
						value={coverUrl}
						onChange={e => setCoverUrl(e.target.value)}
					/>
					<button
						onClick={() => {
							setCoverUrl(manga.originalCoverUrl);
							setUseProxy(false);
						}}
					>
						Revert to original image
					</button>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor='proxy'>Use proxy:</label>
					<button
						type='checkbox'
						name='proxy'
						id='proxy'
						className='checkbox'
						data-ischecked={useProxy}
						onClick={() => setUseProxy(bool => !bool)}
					></button>
				</div>

				<a
					href='https://imgbb.com/'
					target='_blank'
					rel='nofollow noreferrer noopener'
				>
					Upload an image
				</a>

				{imageSize && (
					<p>
						Preview: {imageSize.source} (rendered as {imageSize.rendered})
					</p>
				)}

				<div className={styles.imageContainer}>
					<img
						src={renderedUrl}
						alt='Failed to load'
						onLoad={imageLoadedHandler}
						onError={() => setImageSize()}
					/>
				</div>
			</main>

			<footer className={styles.footer}>
				<button type='reset' onClick={() => closePopup()}>
					Cancel
				</button>
				<button type='submit' onClick={() => submitHandler()}>
					Save changes
				</button>
			</footer>
		</div>
	);
}
