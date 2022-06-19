import { useState } from 'react';

import styles from '../ContextMenu/ContextMenu.module.css';

export default function Dropdown({
	items,
	isShown,
	pos,
	size = '',
	showSelected = false,
}) {
	const [selectedIndex, setSelectedIndex] = useState(
		items.findIndex(item => item?.default)
	);

	return (
		<div
			className={`${styles.dropdown} ${isShown ? 'visible' : ''} ${size}`}
			style={{
				left: pos.x,
				top: pos.y,
			}}
			onClick={e => e.preventDefault()}
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
							setSelectedIndex(index);
						}}
						className={
							styles.item +
							(showSelected &&
							((selectedIndex === undefined && item.default) ||
								selectedIndex === index)
								? ' selected'
								: '')
						}
						disabled={item?.disabled ? true : false}
					>
						{item?.icon && <div className={styles.icon}>{item.icon}</div>}
						<span className={styles.text}>{item?.content || item}</span>
					</div>
				);
			})}
		</div>
	);
}
