import { useState } from 'react';

import styles from './Dropdown.module.css';

export default function Dropdown({
	items,
	title,
	isShown,
	pos,
	size = '',
	showSelected = false,
	_ref,
	noPadding = false,
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
				fontFamily: 'var(--font-family)',
			}}
			onClick={e => e.preventDefault()}
			ref={_ref}
		>
			{title && <p className={styles.title}>{title}</p>}

			{items.map((item, index) => {
				if (!item) return null;

				if (item === 'divider') {
					return <div key={index} className={styles.divider}></div>;
				}

				const isSelectedIndex =
					showSelected &&
					((selectedIndex === undefined && item.default) ||
						selectedIndex === index);

				return (
					<div
						key={index}
						onClick={() => {
							if (item.action && !item.disabled) item.action();
							setSelectedIndex(index);
						}}
						className={[
							styles.item,
							isSelectedIndex ? 'selected' : '',
							noPadding ? 'noPadding' : '',
							item.noHover ? 'noHover' : '',
						].join(' ')}
						disabled={item?.disabled ? true : false}
					>
						{item?.icon && <div className={styles.icon}>{item.icon}</div>}

						{typeof (item?.content || item) === 'string' ? (
							<span className={styles.text}>{item?.content || item}</span>
						) : (
							item?.content || item
						)}
					</div>
				);
			})}
		</div>
	);
}
