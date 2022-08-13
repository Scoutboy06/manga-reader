import { Link } from 'react-router-dom';

import styles from './MediaCard.module.css';

const orientationTypes = {
	folder: 'vertical',
	video: 'horizontal',
};

export default function MediaCard({
	href,
	imgUrl,
	title,
	subtitle,
	type = 'folder',
}) {
	return (
		<Link to={href} className={[styles.card, orientationTypes[type]].join(' ')}>
			<div className={styles.imageContainer}>
				{/* eslint-disable-next-line jsx-a11y/alt-text */}
				<img src={imgUrl} />
				<div className={styles.overlay}></div>
			</div>

			<div className={styles.cardBody}>
				{title && <p className={styles.title}>{title}</p>}
				{subtitle && <p className={styles.subtitle}>{subtitle}</p>}
			</div>
		</Link>
	);
}
