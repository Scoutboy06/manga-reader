import { useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Loader';
import ContextMenu from '../Dropdown';

import styles from './MangaCard.module.css';

export default function MangaCard({ manga, isFetchingUpdates, updates }) {
	const [showTooltip, setShowTooltip] = useState(false);

	return (
		<Link
			to={`/read/${manga.urlName}/${manga.chapter}`}
			className={styles.item}
			onContextMenu={e => {
				e.preventDefault();
				setShowTooltip(true);
			}}
			onBlur={() => {
				setShowTooltip(false);
			}}
		>
			<div
				className={styles.optionsButton}
				onClick={e => {
					e.preventDefault();
					setShowTooltip(bool => !bool);
				}}
			>
				<div></div>
				<div></div>
				<div></div>
			</div>

			{showTooltip && (
				<ContextMenu
					items={[
						{
							action: () => alert('Coming soon'),
							icon: (
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<path d='M0 0h24v24H0V0z' fill='none' />
									<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z' />
								</svg>
							),
							content: 'Info',
						},
						{
							action: () => alert('Coming soon'),
							icon: (
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<path d='M0 0h24v24H0V0z' fill='none' />
									<path d='M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
								</svg>
							),
							content: 'Edit metadata',
						},
						{
							action: () => alert('Coming soon'),
							icon: (
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<path d='M0 0h24v24H0V0z' fill='none' />
									<path d='M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z' />
								</svg>
							),
							content: 'Refresh',
						},
						{
							action: () => alert('Coming soon'),
							icon: (
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<path d='M0 0h24v24H0V0z' fill='none' />
									<path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z' />
								</svg>
							),
							content: 'Delete',
						},
					]}
				/>
			)}

			{!isFetchingUpdates && updates[manga._id] && (
				<div className={styles.updates}></div>
			)}

			{manga.subscribed && isFetchingUpdates && (
				<div className={styles.loader}>
					<Loader size={30} />
				</div>
			)}

			<div className={styles.img}>
				<img src={manga.coverUrl} alt='Img' />
			</div>

			<footer>
				<span>{manga.name}</span>
			</footer>
		</Link>
	);
}
