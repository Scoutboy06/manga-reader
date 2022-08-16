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
			onClick={() => navigate('/mangas/' + manga.urlName)}
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
								<i className='icon'>more_vert</i>
							</BlurContainer>

							<button
								onClick={() => {
									if (
										window.confirm(
											'Are you sure you want to perform this action?'
										)
									) {
										fetchAPI(`/mangas/${manga._id}`, {
											method: 'PATCH',
											body: JSON.stringify({
												hasFinishedReading: !manga.hasFinishedReading,
											}),
										}).then(() => window.location.reload());
									}
								}}
								data-hasfinishedreading={manga.hasFinishedReading}
							>
								<i className='icon'>done</i>
							</button>
						</div>
					</div>

					{!isFetchingUpdates && updates[manga._id] && (
						<div className={styles.updates}></div>
					)}

					{manga.isSubscribed && isFetchingUpdates && (
						<div className={styles.loader}>
							<Loader size={30} />
						</div>
					)}
				</div>
				<div className={styles.details}>
					<p>{manga.name}</p>
					<span>{parseChapterName(manga.currentChapter)}</span>
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
						icon: <i className='icon'>edit</i>,
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
						icon: <i className='icon'>image</i>,
						content: 'Edit cover',
					},
					{
						action: () => {
							if (
								window.confirm('Are you sure you want to perform this action?')
							) {
								fetchAPI(`/mangas/${manga._id}`, {
									method: 'PATCH',
									body: JSON.stringify({ isSubscribed: !manga.isSubscribed }),
								}).then(() => window.location.reload());
							}
						},
						icon: manga.isSubscribed ? (
							<i className='icon'>notifications_off</i>
						) : (
							<i className='icon'>notifications_active</i>
						),
						content: (manga.isSubscribed ? 'Disable' : 'Enable') + ' updates',
					},
					isTouchScreen()
						? {
								action: () => {
									if (
										window.confirm(
											'Are you sure you want to perform this action?'
										)
									) {
										fetchAPI(`/mangas/${manga._id}`, {
											method: 'PATCH',
											body: JSON.stringify({
												hasFinishedReading: !manga.hasFinishedReading,
											}),
										}).then(() => window.location.reload());
									}
								},
								icon: (
									<i
										className='icon'
										style={{
											color: manga.hasFinishedReading ? '#c33' : '#fff',
										}}
									>
										done
									</i>
								),
								content: 'Finished reading',
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
								fetchAPI(`/mangas/${manga._id}`, {
									method: 'DELETE',
								}).then(() => window.location.reload());
							}
						},
						icon: <i className='icon'>delete</i>,
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
