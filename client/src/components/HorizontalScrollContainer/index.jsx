import { useState, useRef, useEffect } from 'react';

import styles from './HorizontalScrollContainer.module.css';

export default function HorizontalScrollContainer({
	children,
	title,
	className = '',
}) {
	const [canScrollTo, setCanScrollTo] = useState({
		left: false,
		right: false,
	});

	const scrollContainerEl = useRef();

	const scroll = dir => {
		const firstChildWidth = scrollContainerEl.current.childNodes[0].offsetWidth;

		const { scrollLeft } = scrollContainerEl.current;

		scrollContainerEl.current.scroll({
			left: scrollLeft + dir * firstChildWidth,
			behavior: 'smooth',
		});
	};

	const scrollHandler = e => {
		const container = e.target;
		const { offsetWidth, scrollLeft, scrollWidth } = container;

		const newCanScroll = {
			left: scrollLeft > 0,
			right: offsetWidth + scrollLeft < scrollWidth,
		};

		if (newCanScroll !== canScrollTo) {
			setCanScrollTo(newCanScroll);
		}
	};

	const resizeHandler = () => {
		scrollHandler({ target: scrollContainerEl.current });
	};

	useEffect(() => {
		const container = scrollContainerEl.current;
		container.addEventListener('scroll', scrollHandler);
		window.addEventListener('resize', resizeHandler);

		scrollHandler({ target: container });

		return () => {
			container.removeEventListener('scroll', scrollHandler);
			window.removeEventListener('resize', resizeHandler);
		};
	}, []);

	return (
		<div style={{ width: '100%' }} className={className}>
			<div className={styles.top}>
				{title && title}
				<div className={styles.buttons}>
					<button
						onClick={() => scroll(-1)}
						disabled={!canScrollTo.left}
						className='icon'
					>
						chevron_left
					</button>

					<button
						onClick={() => scroll(1)}
						disabled={!canScrollTo.right}
						className='icon'
					>
						chevron_right
					</button>
				</div>
			</div>

			<div className={styles.scrollContainer} ref={scrollContainerEl}>
				{children}
			</div>
		</div>
	);
}
