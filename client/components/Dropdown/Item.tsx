import styles from './Dropdown.module.css';
import Link from 'next/link';
import { HTMLAttributes } from 'react';

interface ItemProps extends HTMLAttributes<HTMLElement> {
	href?: string;
	icon?: string;
	iconOutlined?: boolean;
}

function Item({
	children,
	href,
	className,
	icon,
	iconOutlined = false,
	...props
}: ItemProps) {
	const Component = href ? Link : 'button';

	return (
		<Component
			href={href || ''}
			className={[className, styles.item].join(' ')}
			{...props}
		>
			{icon && (
				<i className={`icon ${iconOutlined ? 'outlined' : ''}`}>{icon}</i>
			)}
			{children}
		</Component>
	);
}

export default Item;
