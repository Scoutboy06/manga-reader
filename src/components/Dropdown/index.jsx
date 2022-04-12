import styles from '../ContextMenu/ContextMenu.module.css';

export default function ContextMenu({ items, isShown, pos }) {
	return (
		<div
			className={styles.dropdown}
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
