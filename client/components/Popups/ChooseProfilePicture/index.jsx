import { useRef } from 'react';
import profilePictures from './profilePictures.js';

import HorizontalScrollContainer from '../../HorizontalScrollContainer';

import styles from './ChooseProfilePicture.module.css';

export default function ChooseProfilePicture({ callback, closePopup }) {
	const mainContainer = useRef();

	const selectHandler = imgSrc => {
		callback(imgSrc);
		closePopup();
	};

	return (
		<div className={styles.mainContainer} ref={mainContainer}>
			{profilePictures.map(series => (
				<HorizontalScrollContainer
					title={
						<p style={{ fontSize: 22, color: '#cecece' }}>{series.name}</p>
					}
					key={series.name}
					className={styles.series}
				>
					{series.images.map(image => (
						<button
							onClick={() =>
								selectHandler(`/profilePictures/${series.pathName}/${image}`)
							}
							className={styles.imageContainer}
						>
							<img
								key={image}
								src={`/profilePictures/${series.pathName}/${image}`}
								alt={image}
								loading='lazy'
							/>
						</button>
					))}
				</HorizontalScrollContainer>
			))}
		</div>
	);
}
