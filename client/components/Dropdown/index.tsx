import { useRef, useState, useEffect, Children, ReactNode } from 'react';
import Link from 'next/link';

import styles from './Dropdown.module.css';

export default function Dropdown({ children, ...props }) {
	const [isOpen, setIsOpen] = useState(false);
	const rootEl = useRef<HTMLDivElement>(null);

	const handleWindowClick = (e: Event) => {
		const path = e.composedPath();

		if (rootEl.current && !path.includes(rootEl.current)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('click', handleWindowClick);
		} else {
			window.removeEventListener('click', handleWindowClick);
		}

		return () => {
			window.removeEventListener('click', handleWindowClick);
		};
	}, [isOpen]);

	return (
		<div
			className={styles.container + (isOpen ? ' open' : '')}
			ref={rootEl}
			{...props}
		>
			{Children.map(children, child => {
				// Button
				if (child?.type === Button) {
					return (
						<button
							{...child.props}
							onClick={() => {
								child.props.onClick?.();
								setIsOpen(!isOpen);
							}}
						>
							{child.props.children}
						</button>
					);
				}

				// Items
				if (child?.type === Items) {
					if (isOpen) return child;
					return null;
				}

				return child;
			})}
		</div>
	);
}

function Button(props) {
	return null;
}

interface ItemsProps {
	children?: ReactNode;
	className?: string;
	placement?: 'bl' | 'br' | 'tl' | 'tr';
	style?: object;
}

function Items({
	children,
	className,
	placement = 'bl',
	...props
}: ItemsProps) {
	return (
		<div
			className={[styles.dropdown, placement, className].join(' ')}
			{...props}
		>
			{Children.map(children, child => {
				// child?.type === 'hr')
				if (child === 'divider') {
					return <div className={styles.divider}></div>;
				}

				return child;
			})}
		</div>
	);
}

interface ItemProps {
	children?: ReactNode;
	href?: string;
	className?: string;
	icon?: string;
	iconOutlined?: boolean;
	[key: string]: any;
}

function Item({
	children,
	href,
	className,
	icon,
	iconOutlined = false,
	...props
}: ItemProps) {
	let element = {
		type: href ? Link : 'button',
	};

	return (
		<element.type
			href={href || ''}
			className={[className, styles.item].join(' ')}
			{...props}
		>
			{icon && (
				<i className={`icon ${iconOutlined ? 'outlined' : ''}`}>{icon}</i>
			)}
			{children}
		</element.type>
	);
}

Dropdown.Button = Button;
Dropdown.Items = Items;
Dropdown.Item = Item;
