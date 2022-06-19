import { useRef } from 'react';
import profilePictures from './profilePictures.js';

import styles from './index.module.css';

export default function ChooseProfilePicture({ callback, closePopup }) {
	const mainContainer = useRef();

	const scrollImages = (index, direction) => {
		const seriesContainer = mainContainer.current.children[index];
		const imagesContainer = seriesContainer.children[3];

		const mainContainerWidth =
			mainContainer.current.getBoundingClientRect().width;
		const imagesContainerWidth = imagesContainer.getBoundingClientRect().width;

		if (imagesContainerWidth <= mainContainerWidth) return;

		const scrollMultiplier = Math.min(Math.floor(mainContainerWidth / 160), 4);

		// Get the current position and caclulate the new one
		const leftString = imagesContainer.style.left;
		const prevScroll = Number(leftString.replace('px', ''));
		let newScroll = prevScroll + direction * (160 + 8) * scrollMultiplier;
		if (newScroll > 0) newScroll = 0;
		else if (newScroll + imagesContainerWidth < mainContainerWidth)
			newScroll = -imagesContainerWidth + mainContainerWidth;
		imagesContainer.style.left = `${newScroll}px`;
	};

	const selectHandler = imgSrc => {
		callback(imgSrc);
		closePopup();
	};

	return (
		<div className={styles.mainContainer} ref={mainContainer}>
			{profilePictures.map((series, seriesIndex) => (
				<div className={styles.series} key={series.pathName}>
					<h3>{series.name}</h3>

					<button
						className={[styles.pagination, styles.left].join(' ')}
						onClick={() => scrollImages(seriesIndex, 1)}
					>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M24 24H0V0h24v24z' fill='none' />
							<path d='M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z' />
						</svg>
					</button>

					<button
						className={[styles.pagination, styles.right].join(' ')}
						onClick={() => scrollImages(seriesIndex, -1)}
					>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M24 24H0V0h24v24z' fill='none' />
							<path d='M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z' />
						</svg>
					</button>

					<div className={styles.images} style={{ left: '0px' }}>
						{series.images.map(image => (
							<button
								key={series.pathName + image}
								onClick={() =>
									selectHandler(`/profilePictures/${series.pathName}/${image}`)
								}
							>
								<img
									src={`/profilePictures/${series.pathName}/${image}`}
									alt={image}
									loading='lazy'
								/>
							</button>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
