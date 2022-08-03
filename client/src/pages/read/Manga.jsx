import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';

import fetchAPI from '../../functions/fetchAPI';
import getChapterNumber from '../../functions/getChapterNumber';

import Loader from '../../components/Loader';
import Head from '../../components/Head';
import Select from '../../components/Select';

import { ProfileContext } from '../../contexts/ProfileContext';
import { SettingsContext } from '../../contexts/SettingsContext';

import styles from './read.module.css';

export default function Manga() {
	const params = useParams();
	const navigate = useNavigate();
	const [profileData] = useContext(ProfileContext);
	const [settings, settingsActions] = useContext(SettingsContext);

	const [chapters, setChapters] = useState({
		prev: null,
		curr: params.chapter,
		next: null,
		title: null,
	});
	const [images, setImages] = useState();
	const [originalUrl, setOriginalUrl] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [mangaMeta, setMangaMeta] = useState();
	const [imageScrollProgress, setImageScrollProgress] = useState('-');
	const [imageScale, setImageScale] = useState(settings.imageScale);

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
		(async function () {
			setIsLoading(true);

			let meta;
			if (!mangaMeta) {
				meta = await fetchAPI(
					`/api/mangas/${params.name}?userId=${profileData.currentProfile._id}`,
					{},
					false
				);
				setMangaMeta(meta);
			} else {
				meta = mangaMeta;
			}

			if (!params.chapter) {
				navigate(`/read/manga/${params.name}/${meta.chapter}`, {
					replace: true,
				});
				return;
			}

			if (params.chapter === chapters.curr && mangaMeta) {
				setIsLoading(false);
				return;
			}

			const chaps = await fetchAPI(
				`/api/mangas/${params.name}/${params.chapter}`,
				{},
				true
			);

			setChapters({
				prev: chaps.prevPath,
				curr: params.chapter,
				next: chaps.nextPath,
				title: chaps.chapterTitle,
			});
			setImages(chaps.images);
			setOriginalUrl(chaps.originalUrl);
			setIsLoading(false);

			fetchAPI(`/api/mangas/${meta._id}/updateProgress`, {
				method: 'PUT',
				body: JSON.stringify({
					chapter: params.chapter,
					isLast: !chaps.nextPath,
				}),
			});
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params, profileData.isLoading]);

	useEffect(() => {
		settingsActions.setImageScale(imageScale);
	}, [imageScale, settingsActions]);

	return (
		<>
			<section
				className={styles.chapters}
				style={{
					width:
						imageScale === 'pageWidth' ? '100%' : `calc(70% * ${imageScale})`,
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
									<img
										src={image}
										alt={chapters.title + ' - ' + (index + 1)}
										loading='lazy'
										onLoad={e => imageLoadHandler(e, index)}
									/>
								</div>
							))}
					</>
				)}
			</section>

			<div className={styles.progressContainer}>
				<span>Ch. {getChapterNumber(chapters.curr)}</span>
				<span>
					{imageScrollProgress || '-'} / {images?.length || '-'}
				</span>
			</div>
		</>
	);
}
