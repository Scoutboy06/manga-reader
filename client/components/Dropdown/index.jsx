import { useRef, useState, useEffect, Children } from 'react';
import Link from 'next/link';

import styles from './Dropdown.module.css';

export default function Dropdown({ children, ...props }) {
	const [isOpen, setIsOpen] = useState(false);
	const rootEl = useRef();

	const handleWindowClick = e => {
		const path = e.composedPath();

		if (!path.includes(rootEl.current)) {
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
				if (child.type === Button) {
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
				if (child.type === Items) {
					if (isOpen) return child;
					return null;
				}

				return child;
			})}
		</div>
	);
}

function Button() {
	return null;
}

function Items({ children, className, placement = 'bl' }) {
	return (
		<div className={[styles.dropdown, placement, className].join(' ')}>
			{Children.map(children, child => {
				if (child === 'divider' || child?.type === 'hr') {
					return <div className={styles.divider}></div>;
				}

				return child;
			})}
		</div>
	);
}

function Item({ children, className, icon, iconOutlined = false, ...props }) {
	let element = {
		type: props.href ? Link : 'button',
	};

	return (
		<element.type {...props} className={[className, styles.item].join(' ')}>
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
