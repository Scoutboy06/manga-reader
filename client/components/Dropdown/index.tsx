import styles from './Dropdown.module.css';
import {
	useRef,
	useState,
	useEffect,
	HTMLAttributes,
	Dispatch,
	SetStateAction,
	ElementType,
} from 'react';
import Toggle from './Toggle';
import Menu from './Menu';
import Item from './Item';
import Divider from './Divider';
import DropdownContext, { DropdownPlacement } from './Context';

export interface DropdownProps extends HTMLAttributes<HTMLElement> {
	rootCloseEvent?: 'click' | 'mousedown';
	placement: DropdownPlacement;
	isOpen?: boolean;
	setIsOpen?: Dispatch<SetStateAction<boolean>>;
	as?: string | ElementType;
	onOpen?: () => any;
	onClose?: () => any;
}

function Dropdown({
	rootCloseEvent = 'click',
	children,
	placement,
	className,
	isOpen: _isOpen,
	setIsOpen: _setIsOpen,
	as: Component = 'div',
	onOpen,
	onClose,
	...props
}: DropdownProps) {
	const isHandled = _isOpen !== undefined && _setIsOpen !== undefined;
	const [isOpen, setIsOpen] = useState(false);
	const isActuallyOpen = (isHandled && _isOpen) || (!isHandled && isOpen);
	const rootEl = useRef<HTMLDivElement>(null);

	const handleWindowClick = (e: Event) => {
		const path = e.composedPath();

		if (rootEl.current && !path.includes(rootEl.current)) {
			setIsOpen(false);
			_setIsOpen?.(false);
		}
	};

	useEffect(() => {
		if (isActuallyOpen) {
			window.addEventListener(rootCloseEvent, handleWindowClick);
			onOpen?.();
		} else {
			window.removeEventListener(rootCloseEvent, handleWindowClick);
			onClose?.();
		}

		return () => {
			window.removeEventListener(rootCloseEvent, handleWindowClick);
		};
	}, [isActuallyOpen]);

	return (
		<DropdownContext.Provider
			value={[
				{
					isOpen: isHandled ? _isOpen : isOpen,
					placement,
				},
				{
					setIsOpen: isHandled ? _setIsOpen : setIsOpen,
				},
			]}
		>
			<Component
				className={[
					className,
					styles.container,
					(isHandled && _isOpen) || (!isHandled && isOpen) ? 'open' : '',
				].join(' ')}
				ref={rootEl}
				{...props}
			>
				{children}
			</Component>
		</DropdownContext.Provider>
	);
}

export default Object.assign(Dropdown, {
	Toggle,
	Menu,
	Item,
	Divider,
});
