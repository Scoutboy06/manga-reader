import styles from './Dropdown.module.css';
import { HTMLAttributes, ReactNode } from 'react';
import { useDropdownContext } from './Context';

interface MenuProps extends HTMLAttributes<HTMLElement> {}

function DropdownMenu({ children, className, ...props }: MenuProps) {
	const [{ isOpen, placement }] = useDropdownContext();

	if (!isOpen) return null;

	return (
		<div
			className={[styles.dropdown, placement, className].join(' ')}
			{...props}
		>
			{children}
		</div>
	);
}

export default DropdownMenu;
