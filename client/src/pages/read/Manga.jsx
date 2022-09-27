import { useState, useEffect, useContext, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

import Loader from '../../components/Loader';

import { SettingsContext } from '../../contexts/SettingsContext';

import styles from './read.module.css';

export default function Manga() {
	const [{ contentWidth }] = useContext(SettingsContext);
	const { isLoading, chapterMeta } = useOutletContext();

	const [imageScrollProgress, setImageScrollProgress] = useState('-');

	const imagesContainerRef = useRef();
	const imageSizes = useRef([]);

	const scrollHandler = () => {
		if (!chapterMeta?.images) return;
		let currentImageIndex = 0;

		for (let i = 0; i < chapterMeta.images.length; i++) {
			const imgY = imageSizes.current[i];

			if (window.scrollY + window.innerHeight * 0.5 > imgY) {
				currentImageIndex = i;
			}
		}

		setImageScrollProgress(currentImageIndex + 1);
	};

	const setImagesTopCoords = (start = 0, end = chapterMeta?.images?.length) => {
		if (!chapterMeta?.images) return;

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
		if (chapterMeta?.images) {
			document.addEventListener('scroll', scrollHandler);
			window.addEventListener('resize', setImagesTopCoords);
			setImagesTopCoords();
		}

		return () => {
			document.removeEventListener('scroll', scrollHandler);
			window.removeEventListener('resize', setImagesTopCoords);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chapterMeta]);

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
						{chapterMeta?.images?.map((image, index) => (
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
				<span>Ch. {chapterMeta?.number}</span>
				<span>
					{imageScrollProgress || '-'} / {chapterMeta?.images?.length || '-'}
				</span>
			</div>
		</>
	);
}
