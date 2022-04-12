import { useState, useEffect, useRef } from 'react';

import styles from './ContextMenu.module.css';

export default function ContextMenu({
	items,
	cursorPos,
	pos: fixedPos,
	isShown,
}) {
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const parentEl = useRef();

	useEffect(() => {
		if (!cursorPos) return;

		const { width, height } = parentEl.current.getBoundingClientRect();
		let x = cursorPos.x - window.scrollX + 2;
		let y = cursorPos.y - window.scrollY + 2;
		// console.log('------------------');
		// console.log(x, y);
		// console.log(width, height);

		if (x < 0) x = 5;
		else if (x + width > window.innerWidth) x = window.innerWidth - width - 5;

		if (y < 0) y = 5;
		else if (y + height > window.innerHeight)
			y = window.innerHeight - height - 5;

		setPos({ x, y });
	}, [cursorPos]);

	return (
		<div
			className={styles.tooltip}
			data-isshown={isShown}
			style={{
				left: fixedPos?.x || pos.x,
				top: fixedPos?.y || pos.y,
			}}
			onClick={e => e.preventDefault()}
			ref={parentEl}
		>
			{items.map((item, index) => {
				if (item === null) return null;

				if (item === 'divider') {
					return <div key={index} className={styles.divider}></div>;
				}

				return (
					<div
						key={index}
						onClick={() => {
							if (item.action && !item.disabled) item.action();
						}}
						className={styles.item}
						disabled={item?.disabled ? true : false}
					>
						{item.icon && <div className={styles.icon}>{item.icon}</div>}
						<span className={styles.text}>{item?.content || item}</span>
					</div>
				);
			})}
		</div>
	);
}
