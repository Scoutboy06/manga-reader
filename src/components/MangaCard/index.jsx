import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Loader from '../Loader';
import ContextMenu from '../ContextMenu';
import fetchAPI from '../../functions/fetchAPI';

import styles from './MangaCard.module.css';

export default function MangaCard({ manga, isFetchingUpdates, updates }) {
	const history = useHistory();

	const [showTooltip, setShowTooltip] = useState(false);
	const [optionsPos, setOptionsPos] = useState({ x: 0, y: 0, offset: 0 });
	const optionsBtn = useRef();

	const updateOptionsPos = e => {
		e.preventDefault();
		e.stopPropagation();

		let shouldShow;
		setShowTooltip(bool => {
			shouldShow = !bool;
			return !bool;
		});
		if (!shouldShow) return;

		const { height, x, y } = optionsBtn.current.getBoundingClientRect();
		setOptionsPos({
			x: x + height / 2,
			y: y + height / 2,
			offset: height / 2,
		});
	};

	return (
		<div
			className={styles.card}
			onClick={() => history.push('/read/' + manga.urlName)}
			onContextMenu={e => {
				e.preventDefault();
				optionsBtn.current.click();
				optionsBtn.current.focus();
			}}
		>
			<div className={styles.cardBox}>
				<div className={styles.cardContent}>
					<div className={styles.cardPadder}></div>

					<div
						className={styles.imageContainer}
						style={{ backgroundImage: `url(${manga.coverUrl})` }}
					></div>

					<div className={styles.cardOverlay}>
						<div
							className={styles.actionButtons}
							onClick={e => e.stopPropagation()}
						>
							<button
								ref={optionsBtn}
								onClick={updateOptionsPos}
								onBlur={() => setShowTooltip(false)}
							>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<path d='M0 0h24v24H0V0z' fill='none' />
									<path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' />
								</svg>
							</button>

							<button
								onClick={() => {
									if (
										window.confirm(
											'Are you sure you want to perform this action?'
										)
									) {
										fetchAPI(`/api/mangas/${manga._id}/finished`, {
											method: 'PUT',
											body: JSON.stringify({ isFinished: !manga.finished }),
										}).then(() => window.location.reload());
									}
								}}
								data-finished={manga.finished}
							>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<path d='M0 0h24v24H0V0z' fill='none' />
									<path d='M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z' />
								</svg>
							</button>
						</div>
					</div>

					{!isFetchingUpdates && updates[manga._id] && (
						<div className={styles.updates}></div>
					)}

					{manga.subscribed && isFetchingUpdates && (
						<div className={styles.loader}>
							<Loader size={30} />
						</div>
					)}
				</div>
				<div className={styles.details}>
					<p>{manga.name}</p>
					<span>{manga.chapter}</span>
				</div>
			</div>

			<ContextMenu
				items={[
					{
						action: () => {},
						icon: (
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
								<path d='M0 0h24v24H0V0z' fill='none' />
								<path d='M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
							</svg>
						),
						content: 'Edit metadata',
						disabled: true,
					},
					{
						action: () => {},
						icon: (
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
								<path d='M0 0h24v24H0V0z' fill='none' />
								<path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.9 13.98l2.1 2.53 3.1-3.99c.2-.26.6-.26.8.01l3.51 4.68c.25.33.01.8-.4.8H6.02c-.42 0-.65-.48-.39-.81L8.12 14c.19-.26.57-.27.78-.02z' />
							</svg>
						),
						content: 'Edit images',
						disabled: true,
					},
					'divider',
					{
						action: () => {
							if (
								window.confirm(
									'Are you sure you want to delete this manga? The action cannot be undone.'
								)
							) {
								fetchAPI('/api/mangas/' + manga._id, {
									method: 'DELETE',
								}).then(() => window.location.reload());
							}
						},
						icon: (
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
								<path d='M0 0h24v24H0V0z' fill='none' />
								<path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z' />
							</svg>
						),
						content: 'Delete',
					},
				]}
				cursorPos={optionsPos}
				isShown={showTooltip}
				offset={optionsPos.offset}
			/>
		</div>
	);
}
