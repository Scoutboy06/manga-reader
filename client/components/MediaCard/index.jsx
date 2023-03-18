import { useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import DropdownButton from '@/components/DropdownButton';
import Loader from '@/components/Loader';

import styles from './MediaCard.module.css';

export default function MediaCard({
	href,
	imgUrl,
	title,
	subtitle,
	orientation = 'vertical',
	seriesHref,
	dropdownItems,
	showSpinner = false,
	hasUpdates = false,
}) {
	const router = useRouter();

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
				<Image
					src={imgUrl}
					width={orientation === 'vertical' ? 200 : 350}
					height={orientation === 'vertical' ? 300 : 200}
					alt={title}
				/>

				<button
					className={styles.navigateButton}
					onClick={() => router.push(href)}
				></button>

				<div className={styles.overlayContainer}>
					<div className={styles.buttonsContainer}>
						{dropdownItems && (
							<DropdownButton className='icon' dropdownItems={dropdownItems}>
								more_vert
							</DropdownButton>
						)}
					</div>
				</div>
			</div>

			<div className={styles.cardBody}>
				{title && (
					<button
						className={styles.title}
						onClick={e => {
							e.preventDefault();
							router.push(seriesHref || href);
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
