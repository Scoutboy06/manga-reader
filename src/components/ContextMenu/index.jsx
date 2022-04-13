import { useState, useEffect, useRef } from 'react';

import styles from './ContextMenu.module.css';

export default function ContextMenu({ items, cursorPos, offset, isShown }) {
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const parentEl = useRef();

	useEffect(() => {
		if (!cursorPos || !isShown) return;

		const { width, height } = parentEl.current.getBoundingClientRect();
		let x = cursorPos.x - offset;
		let y = cursorPos.y + offset;

		if (x + width > window.innerWidth) x = cursorPos.x - width + offset;
		if (y + height > window.innerHeight) y = cursorPos.y - offset - height;

		setPos({ x, y });
	}, [items, cursorPos, isShown, offset]);

	return (
		<div
			className={styles.tooltip}
			data-isshown={isShown}
			style={{
				left: pos.x,
				top: pos.y,
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
