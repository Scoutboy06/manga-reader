import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';

import getChapterNumber from '../../functions/getChapterNumber';

import Loader from '../../components/Loader';

import { SettingsContext } from '../../contexts/SettingsContext';

import styles from './read.module.css';

export default function Manga() {
	const params = useParams();
	const [{ contentWidth }] = useContext(SettingsContext);
	const { isLoading, content: images } = useOutletContext();

	const [imageScrollProgress, setImageScrollProgress] = useState('-');

	const imagesContainerRef = useRef();
	const imageSizes = useRef([]);

	const scrollHandler = () => {
		let currentImageIndex = 0;

		for (let i = 0; i < images.length; i++) {
			const imgY = imageSizes.current[i];

			if (window.scrollY + window.innerHeight * 0.5 > imgY) {
				currentImageIndex = i;
			}
		}

		setImageScrollProgress(currentImageIndex + 1);
	};

	const setImagesTopCoords = (start = 0, end = images.length) => {
		if (!images) return;

		for (let i = start; i < end; i++) {
			const el = imagesContainerRef.current.children[i];
			const { y } = el.getBoundingClientRect();
			imageSizes.current[i] = y + window.scrollY;
		}

		if (imageScrollProgress === '-') scrollHandler();
	};

	const imageLoadHandler = (e, index) => {
		e.target.parentElement.setAttribute('data-isloaded', true);

		setImagesTopCoords(index);
	};

	useEffect(() => {
		if (images) {
			document.addEventListener('scroll', scrollHandler);
			window.addEventListener('resize', setImagesTopCoords);
			setImagesTopCoords();
		}

		return () => {
			document.removeEventListener('scroll', scrollHandler);
			window.removeEventListener('resize', setImagesTopCoords);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [images]);

	useEffect(() => {
		const ANIMATION_DURATION = 300;

		setTimeout(() => {
			setImagesTopCoords();
			scrollHandler();
		}, ANIMATION_DURATION + 50);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentWidth]);

	return (
		<>
			<section
				className={styles.chapters}
				style={{
					width:
						contentWidth === 'pageWidth'
							? '100%'
							: `calc(70% * ${contentWidth})`,
				}}
				ref={imagesContainerRef}
			>
				{isLoading ? (
					<div style={{ height: 100, marginTop: 30, marginBottom: 30 }}>
						<Loader size={100} style={{ left: 'calc(50% - 50px)' }} />
					</div>
				) : (
					<>
						{images &&
							images.map((image, index) => (
								<div
									className={styles.imageContainer}
									key={index}
									data-isloaded={false}
								>
									{/* eslint-disable-next-line jsx-a11y/alt-text */}
									<img
										src={image}
										loading='lazy'
										onLoad={e => imageLoadHandler(e, index)}
									/>
								</div>
							))}
					</>
				)}
			</section>

			<div className={styles.progressContainer}>
				<span>Ch. {getChapterNumber(params.chapter)}</span>
				<span>
					{imageScrollProgress || '-'} / {images?.length || '-'}
				</span>
			</div>
		</>
	);
}
