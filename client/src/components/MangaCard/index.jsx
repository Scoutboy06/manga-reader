import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from '../Loader';
import ContextMenu from '../ContextMenu';
import BlurContainer from '../BlurContainer';
import EditMetadata from '../Popups/EditMetadata';
import EditMangaCover from '../Popups/EditMangaCover';

import fetchAPI from '../../functions/fetchAPI';
import parseChapterName from '../../functions/parseChapterName';
import isTouchScreen from '../../functions/isTouchScreen';

import { PopupContext } from '../../contexts/PopupContext';

import styles from './MangaCard.module.css';

export default function MangaCard({ manga, isFetchingUpdates, updates }) {
	const navigate = useNavigate();
	const [, popupActions] = useContext(PopupContext);

	const [showTooltip, setShowTooltip] = useState(false);
	const [optionsPos, setOptionsPos] = useState({ x: 0, y: 0, offset: 0 });
	const optionsBtn = useRef();
	const contextMenu = useRef();

	const optionsButtonClickHandler = e => {
		if (e.cancelable) e.preventDefault();
		if (e.cancelBubble) e.stopPropagation();

		setShowTooltip(bool => !bool);

		const { height, x, y } = optionsBtn.current.getBoundingClientRect();

		setOptionsPos({
			x: x + height / 2,
			y: y + height / 2,
			offset: height / 2,
		});
	};

	const optinosButtonBlurHandler = e => {
		const path = e.composedPath();
		if (path.indexOf(contextMenu.current) === -1) {
			setShowTooltip(false);
			return true;
		}
		if (e.cancelable) e.preventDefault();
		if (e.cancelBubble) e.stopPropagation();

		return false;
	};

	return (
		<div
			className={styles.card}
			onClick={() => navigate('/read/' + manga.urlName)}
			onContextMenu={e => {
				e.preventDefault();
				optionsBtn.current.click();
				optionsBtn.current.focus();
			}}
		>
			<div className={styles.cardBox}>
				<div className={styles.cardContent}>
					<div className={styles.cardPadder}></div>

					<div className={styles.imageContainer}>
						<img src={manga.coverUrl} alt={manga.name} loading='lazy' />
					</div>

					<div className={styles.cardOverlay}>
						<div
							className={styles.actionButtons}
							onClick={e => e.stopPropagation()}
						>
							<BlurContainer
								element={{ slug: 'button' }}
								_ref={optionsBtn}
								onClick={optionsButtonClickHandler}
								onBlur={optinosButtonBlurHandler}
							>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<path d='M0 0h24v24H0V0z' fill='none' />
									<path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' />
								</svg>
							</BlurContainer>

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
					<span>{parseChapterName(manga.chapter)}</span>
				</div>
			</div>

			<ContextMenu
				items={[
					{
						action: () => {
							popupActions.createPopup({
								title: 'Edit metadata',
								content: EditMetadata,
								data: manga,
							});
						},
						icon: (
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
								<path d='M0 0h24v24H0V0z' fill='none' />
								<path d='M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
							</svg>
						),
						content: 'Edit metadata',
					},
					{
						action: () => {
							popupActions.createPopup({
								title: 'Edit manga cover',
								content: EditMangaCover,
								data: manga,
							});
						},
						icon: (
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
								<path d='M0 0h24v24H0V0z' fill='none' />
								<path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.9 13.98l2.1 2.53 3.1-3.99c.2-.26.6-.26.8.01l3.51 4.68c.25.33.01.8-.4.8H6.02c-.42 0-.65-.48-.39-.81L8.12 14c.19-.26.57-.27.78-.02z' />
							</svg>
						),
						content: 'Edit cover',
					},
					{
						action: () => {
							if (
								window.confirm('Are you sure you want to perform this action?')
							) {
								fetchAPI(`/api/mangas/${manga._id}/`, {
									method: 'PUT',
									body: JSON.stringify({ subscribed: !manga.subscribed }),
								}).then(() => window.location.reload());
							}
						},
						icon: manga.subscribed ? (
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
								<path d='M0 0h24v24H0z' fill='none' />
								<path d='M20 18.69L7.84 6.14 5.27 3.49 4 4.76l2.8 2.8v.01c-.52.99-.8 2.16-.8 3.42v5l-2 2v1h13.73l2 2L21 19.72l-1-1.03zM12 22c1.11 0 2-.89 2-2h-4c0 1.11.89 2 2 2zm6-7.32V11c0-3.08-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-.15.03-.29.08-.42.12-.1.03-.2.07-.3.11h-.01c-.01 0-.01 0-.02.01-.23.09-.46.2-.68.31 0 0-.01 0-.01.01L18 14.68z' />
							</svg>
						) : (
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
								<path d='M0 0h24v24H0z' fill='none' />
								<path d='M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z' />
							</svg>
						),
						content: (manga.subscribed ? 'Disable' : 'Enable') + ' updates',
					},
					isTouchScreen()
						? {
								action: () => {
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
								},
								icon: (
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
										<path d='M0 0h24v24H0V0z' fill='none' />
										<path
											fill={manga.finished ? '#c33' : '#fff'}
											d='M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z'
										/>
									</svg>
								),
								content: manga.finished
									? 'Set to uncompleted'
									: 'Set to completed',
						  }
						: null,
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
				_ref={contextMenu}
			/>
		</div>
	);
}
