import styles from './Dropdown.module.css';

export default function Dropdown({
	items,
	isShown,
	pos,
	_ref,
	noPadding = false,
}) {
	return (
		<div
			className={styles.dropdown + (isShown ? ' visible' : '')}
			style={{
				left: pos.x,
				top: pos.y,
				fontFamily: 'var(--font-family)',
			}}
			onClick={e => e.preventDefault()}
			ref={_ref}
		>
			{items.map((item, index) => {
				if (!item) return null;

				if (item === 'divider') {
					return <div key={index} className={styles.divider}></div>;
				}

				return (
					<div
						key={index}
						onClick={() => {
							if (item.action && !item.disabled) item.action();
						}}
						className={[
							styles.item,
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
