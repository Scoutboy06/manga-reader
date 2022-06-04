import { useContext, useEffect, useState } from 'react';

import { PopupContext } from '../../contexts/PopupContext';

import styles from './PopupCreator.module.css';

export default function PopupCreator() {
	const [popups, actions] = useContext(PopupContext);
	const [showBlackScreen, setShowBlackScreen] = useState(false);

	useEffect(() => {
		if (popups.length > 0) {
			document.body.style.overflow = 'hidden';
			setShowBlackScreen(true);
		} else {
			setShowBlackScreen(false);
			document.body.style.overflow = '';
		}
	}, [popups]);

	return (
		<div className={styles.blackContainer} data-show={showBlackScreen}>
			{popups.map((popup, popupIndex) => (
				<div
					className={styles.container}
					key={popupIndex}
					data-show={
						popup.isVisible &&
						(popupIndex === popups.length - 1 ||
							(popups?.[popupIndex + 1] && !popups[popupIndex + 1].isVisible))
					}
				>
					<div className={styles.header}>
						<h5>{popup.title}</h5>
						<button
							className={styles.closeBtn}
							onClick={() => actions.closePopup(popupIndex)}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='#888'
							>
								<path d='M0 0h24v24H0V0z' fill='none' />
								<path d='M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z' />
							</svg>
						</button>
					</div>
					<div className={styles.content}>
						<popup.content
							closePopup={() => actions.closePopup(popupIndex)}
							data={popup.data}
							callback={popup.callback}
						/>
					</div>
				</div>
			))}
		</div>
	);
}
