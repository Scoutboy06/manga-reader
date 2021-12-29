import { Link } from 'react-router-dom';
import Loader from '../Loader';

import styles from './MangaCard.module.css';

export default function MangaCard({ manga, isFetchingUpdates, updates }) {
	return (
		<Link to={`/${manga.urlName}/${manga.chapter}`} className={styles.item}>
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
