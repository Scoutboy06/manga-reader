import { useState, useEffect } from 'react';

import styles from './PopupOverlay.module.css';

export default function PopupOverlay({
	isShown,
	setVisibility,
	children,
	title,
}) {
	const [isVisible, setIsVisible] = useState(isShown);
	// const [showContent, setShowContent] = useState(isShown);

	const hide = e => {
		if (e?.key && e.key !== 'Escape') return;
		setVisibility(false);
	};

	useEffect(() => {
		if (isShown) {
			setIsVisible(true);
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', hide);
		} else {
			setIsVisible(false);
			document.body.style.overflow = '';
			window.removeEventListener('keydown', hide);
		}

		return () => {
			window.removeEventListener('keydown', hide);
		};
	}, [isShown]);

	return (
		<>
			<div
				className={styles.blackContainer}
				data-show={isVisible}
				onClick={e => {
					if (e.nativeEvent.path.length === 6) hide();
				}}
			>
				<div className={styles.container}>
					<div className={styles.header}>
						<h5>{title}</h5>
						<button className={styles.closeBtn} onClick={hide}>
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
					<div className={styles.content}>{children}</div>
				</div>
			</div>
		</>
	);
}
