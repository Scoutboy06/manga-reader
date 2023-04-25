import { HTMLAttributes } from 'react';
import { useDropdownContext } from './Context';

interface ToggleProps extends HTMLAttributes<HTMLElement> {
	toggleIconLeft?: boolean;
	toggleIconRight?: boolean;
}

function Toggle({
	className,
	children,
	onClick,
	toggleIconLeft,
	toggleIconRight,
	...props
}: ToggleProps) {
	const [{ isOpen }, { setIsOpen }] = useDropdownContext();

	return (
		<button
			{...props}
			className={[className, isOpen ? 'open' : ''].join(' ')}
			onClick={e => {
				setIsOpen?.(!isOpen);
				onClick?.(e);
			}}
		>
			{toggleIconLeft && <i className='icon'>arrow_drop_down</i>}
			{children}
			{toggleIconRight && <i className='icon'>arrow_drop_down</i>}
		</button>
	);
}

export default Toggle;
