import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import DropdownButton from '../DropdownButton';
import Loader from '../Loader';

import styles from './MediaCard.module.css';

export default function MediaCard({
	href,
	imgUrl,
	title,
	subtitle,
	orientation = 'vertical',
	seriesHref,
	dropdownItems = [],
	showSpinner = false,
	hasUpdates = false,
}) {
	const navigate = useNavigate();

	const mainContainer = useRef();

	return (
		<div className={`${styles.card} ${orientation}`} ref={mainContainer}>
			{showSpinner && (
				<div className={styles.loader}>
					<Loader size={30} />
				</div>
			)}
			{hasUpdates && !showSpinner && <div className={styles.updates}></div>}

			<div className={styles.imageContainer}>
				<img src={imgUrl} alt={title} />

				<button
					className={styles.navigateButton}
					onClick={() => navigate(href)}
				></button>

				<div className={styles.overlayContainer}>
					<div className={styles.buttonsContainer}>
						<DropdownButton className='icon' dropdownItems={dropdownItems}>
							more_vert
						</DropdownButton>
					</div>
				</div>
			</div>

			<div className={styles.cardBody}>
				{title && (
					<button
						className={styles.title}
						onClick={e => {
							e.preventDefault();
							navigate(seriesHref || href);
						}}
					>
						{title}
					</button>
				)}
				{subtitle && <p className={styles.subtitle}>{subtitle}</p>}
			</div>
		</div>
	);
}
