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
							icon: <img src='/icons/info_white_24dp.svg' alt='' />,
							content: 'Info',
						},
						{
							action: () => alert('Coming soon'),
							icon: <img src='/icons/edit_white_24dp.svg' alt='' />,
							content: 'Edit metadata',
						},
						{
							action: () => alert('Coming soon'),
							icon: <img src='/icons/refresh_white_24dp.svg' alt='' />,
							content: 'Refresh',
						},
						{
							action: () => alert('Coming soon'),
							icon: <img src='/icons/delete_white_24dp.svg' alt='' />,
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
