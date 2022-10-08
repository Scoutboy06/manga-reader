import { useRef, useState, useEffect } from 'react';

import Dropdown from '../Dropdown';
import BlurContainer from '../BlurContainer';

export default function DropdownButton({
	className,
	style,
	children,
	dropdownItems,
	title,
	noPadding = false,
	offset = { x: 0, y: 0 },
}) {
	const container = useRef();
	const dropdown = useRef();

	const [isVisible, setVisibility] = useState(false);

	const handleClick = e => {
		const drop = dropdown.current.getBoundingClientRect();
		const parent = container.current.getBoundingClientRect();

		let x = parent.x + offset.x;
		let y = parent.y + parent.height + offset.y;

		// Right aligned
		if (x + drop.width > window.innerWidth) {
			x = parent.x - drop.width + parent.width;
		}

		// Top aligned
		if (y + drop.height > window.innerHeight) {
			y = parent.y - drop.height;
		}

		dropdown.current.style.top = y + 'px';
		dropdown.current.style.left = x + 'px';

		if (
			e?.nativeEvent?.target === container.current ||
			typeof e === 'boolean'
		) {
			setVisibility(v => (typeof e === 'boolean' ? e : !v));
		}
	};

	const handleScrollAndResize = () => {
		handleClick(true);
	};

	useEffect(() => {
		if (isVisible) {
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
	}, [isVisible]);

	return (
		<BlurContainer
			element={{ slug: 'button' }}
			onClick={handleClick}
			onBlur={() => setVisibility(false)}
			className={`${className || ''} ${isVisible ? 'show-dropdown' : ''}`}
			style={{ ...style, position: 'relative' }}
			_ref={container}
		>
			{children}

			<Dropdown
				title={title}
				items={dropdownItems}
				isShown={isVisible}
				showSelected={false}
				_ref={dropdown}
				noPadding={noPadding}
			/>
		</BlurContainer>
	);
}
