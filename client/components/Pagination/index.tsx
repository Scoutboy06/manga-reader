import styles from './Pagination.module.css';

interface Props {
	currentPage: number;
	lastPage: number;
	paginate: (pageNumber: number) => void;
}

export default function Pagination({ currentPage, lastPage, paginate }: Props) {
	const showDotsOnLeft = currentPage >= 5;
	const showDotsOnRight = lastPage - currentPage >= 4;
	const middleNumber = Math.max(4, Math.min(currentPage, lastPage - 3));

	const Btn = ({ page }: { page: number }) => (
		<button
			className={styles.btn + (currentPage === page ? ' current' : '')}
			onClick={() => paginate(page)}
		>
			{page}
		</button>
	);

	return (
		<nav
			className={styles.pagination}
			aria-label={'pagination navigation'}
			role='navigation'
		>
			{/* Left chevron */}
			<button
				className={styles.btn + ' icon'}
				onClick={() => paginate(currentPage - 1)}
				disabled={currentPage <= 1}
			>
				chevron_left
			</button>

			{lastPage <= 7 ? (
				[...Array(lastPage)].map((_, i) => <Btn page={i + 1} key={i + 1} />)
			) : (
				<>
					<Btn page={1} />

					{showDotsOnLeft ? (
						<div className={styles.dots}>...</div>
					) : (
						<Btn page={2} />
					)}

					<Btn page={middleNumber - 1} />
					<Btn page={middleNumber} />
					<Btn page={middleNumber + 1} />

					{showDotsOnRight ? (
						<div className={styles.dots}>...</div>
					) : (
						<Btn page={lastPage - 1} />
					)}

					<Btn page={lastPage} />
				</>
			)}

			{/* Chevron right */}
			<button
				className={styles.btn + ' icon'}
				onClick={() => paginate(currentPage + 1)}
				disabled={currentPage >= lastPage}
			>
				chevron_right
			</button>
		</nav>
	);
}
