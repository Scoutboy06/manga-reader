import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DropdownButton from '../DropdownButton';
import Loader from '../Loader';

import fetchAPI from '../../functions/fetchAPI';

import styles from './MediaCard.module.css';

const orientationTypes = {
	series: 'vertical',
	video: 'horizontal',
	manga: 'vertical',
};

export default function MediaCard({
	href,
	imgUrl,
	title,
	subtitle,
	type = 'folder',
	completed = { name: 'completed', value: false },
	id,
	seriesHref,
	dropdownItems = [],
	showSpinner = false,
	hasUpdates = false,
}) {
	const navigate = useNavigate();

	const mainContainer = useRef();
	const [showDropdown, setShowDropdown] = useState(false);

	return (
		<div
			className={`${styles.card} ${orientationTypes[type]}`}
			ref={mainContainer}
		>
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
						{window.matchMedia('(hover: hover)').matches && (
							<button
								onClick={e => {
									e.preventDefault();

									if (
										window.confirm(
											'Are you sure you want to perform this action?'
										)
									) {
										fetchAPI(`/mangas/${id}`, {
											method: 'PATCH',
											body: JSON.stringify({
												[completed.name]: !completed.value,
											}),
										}).then(() => window.location.reload());
									}
								}}
								data-completed={completed}
								className='icon'
							>
								done
							</button>
						)}

						<DropdownButton
							visible={showDropdown}
							setVisibility={setShowDropdown}
							mainContainer={mainContainer.current}
							className='icon'
							dropdownItems={dropdownItems}
						>
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
