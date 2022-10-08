import { useState, useEffect, useRef } from 'react';

import BlurContainer from '../BlurContainer';

import styles from './Select.module.css';
import dropdownStyles from '../Dropdown/Dropdown.module.css';

export default function Select({
	children,
	defaultValue,
	value,
	onChange = () => {},
	size = '',
	containerText,
	placement = 'bl',
}) {
	const [selectedValue, setSelectedValue] = useState(defaultValue);
	const [isOpen, setIsOpen] = useState(false);
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const [maxHeight, setMaxHeight] = useState(0);

	const container = useRef();
	const dropdown = useRef();

	const selectHandler = value => {
		onChange(value);
		setSelectedValue(value);
	};

	const updatePosition = () => {
		const parent = container.current.getBoundingClientRect();
		const drop = dropdown.current.getBoundingClientRect();

		const padding = 5;

		const topPos = padding;
		const bottomPos = parent.y + parent.height + padding;
		const leftPos = parent.x;
		const rightPos = parent.x + parent.width - drop.width;

		let x, y, maxHeight;

		// Prefered placement is top
		if (placement[0] === 't') {
			y = topPos;
			maxHeight = parent.y - 2 * padding;
		}
		// Prefered placement is bottom
		else {
			y = bottomPos;
			maxHeight = window.innerHeight - bottomPos - 2 * padding;
		}

		// Prefered alignment is to the right
		if (placement[1] === 'r') x = rightPos;
		// Prefered alignment is to the left
		else x = leftPos;

		dropdown.current.style.left = `${x}px`;
		dropdown.current.style.top = `${y}px`;
		dropdown.current.style.maxHeight =
			Math.min(window.innerHeight - 2 * padding, maxHeight) + 'px';
	};

	const scrollToSelectedItem = () => {
		const selectedIndex = children.findIndex(
			child => child.props.value === selectedValue
		);
		if (!selectedIndex) return;

		const selectedItem = dropdown.current.children[selectedIndex];
		selectedItem.scrollIntoView();
	};

	const handleScrollAndResize = () => {
		updatePosition();
	};

	useEffect(() => {
		if (value !== undefined) setSelectedValue(value);
		// setMaxHeight(window.innerHeight - y)
	}, [value]);

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('scroll', handleScrollAndResize);
			window.addEventListener('resize', handleScrollAndResize);
		} else {
			window.removeEventListener('scroll', handleScrollAndResize);
			window.removeEventListener('resize', handleScrollAndResize);
		}

		return () => {
			window.removeEventListener('scroll', handleScrollAndResize);
			window.removeEventListener('resize', handleScrollAndResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	return (
		<BlurContainer
			className={styles.selectContainer + (isOpen ? ' open' : '')}
			onClick={() => {
				setIsOpen(!isOpen);
				updatePosition();
				scrollToSelectedItem();
			}}
			onBlur={() => setIsOpen(false)}
			element={{ slug: 'button' }}
			_ref={container}
		>
			<span>{containerText}</span>

			<i
				className='icon'
				style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
			>
				arrow_drop_down
			</i>

			<div
				className={`${dropdownStyles.dropdown} ${
					isOpen ? 'visible' : ''
				} ${size}`}
				style={{
					fontFamily: 'var(--font-family)',
				}}
				onClick={e => e.preventDefault()}
				ref={dropdown}
			>
				{children?.map((child, i) =>
					child.type === 'hr' ? (
						<div key={`hr_${i}`} className={dropdownStyles.divider}></div>
					) : (
						<div
							key={child.props.value}
							className={
								dropdownStyles.item +
								(selectedValue === child.props.value ? ' selected' : '')
							}
							onClick={() => selectHandler(child.props.value)}
						>
							<i className={`${styles.check} icon`}>check</i>
							{child}
						</div>
					)
				)}
			</div>
		</BlurContainer>
	);
}
