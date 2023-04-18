import { HTMLAttributes } from 'react';
import { useDropdownContext } from './Context';

interface ToggleProps extends HTMLAttributes<HTMLElement> {}

function Toggle({ className, children, onClick, ...props }: ToggleProps) {
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
			{children}
		</button>
	);
}

export default Toggle;
