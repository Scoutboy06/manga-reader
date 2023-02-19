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
					className={styles.popupContainer}
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
							<i className='icon'>close</i>
						</button>
					</div>

					<div className={styles.body}>
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
