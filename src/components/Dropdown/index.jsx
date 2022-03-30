import styles from './Dropdown.module.css';

export default function Dropdown({ items }) {
	return (
		<div className={styles.tooltip} onClick={e => e.preventDefault()}>
			{items.map((item, index) => {
				if (item === 'divider') {
					return <div key={index} className={styles.divider}></div>;
				}

				return (
					<div
						key={index}
						onClick={item.action || void 0}
						className={styles.item}
					>
						{item.icon && <div className={styles.icon}>{item.icon}</div>}
						<span className={styles.text}>{item?.content || item}</span>
					</div>
				);
			})}
		</div>
	);
}
