import useSWR from 'swr';

import styles from './new.module.css';

const data = {
	urlName: 'horimiya',
	hostId: '631a4a55ec79f581e17157de',
};

export default function NewManga() {
	const { data: manga } = useSWR(
		'/search?' +
			new URLSearchParams({
				type: 'manga',
				urlName: data.urlName,
				hostId: data.hostId,
			})
	);

	return (
		<>
			<main className={styles.main}>
				<div>
					<img src={manga?.poster} alt={manga?.title} />
					<input type='text' defaultValue={manga?.poster} />
				</div>

				<input
					type='text'
					defaultValue={manga?.title}
					className={styles.title}
				/>
				<textarea
					type='text'
					defaultValue={manga?.description}
					className={styles.description}
				/>
				<input
					type='text'
					defaultValue={manga?.genres}
					className={styles.genres}
				/>
				<input
					type='text'
					defaultValue={manga?.otherNames}
					className={styles.otherNames}
				/>
			</main>
		</>
	);
}
