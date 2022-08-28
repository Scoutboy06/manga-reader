import { useRef, useState, useEffect } from 'react';

import Dropdown from '../_Dropdown';
import BlurContainer from '../BlurContainer';

export default function DropdownButton({
	className,
	style,
	children,
	dropdownItems,
	title,
	noPadding = false,
}) {
	const container = useRef();
	const dropdown = useRef();

	const [isVisible, setVisibility] = useState(false);
	const [pos, setPos] = useState({ x: 0, y: 0 });

	const handleClick = e => {
		const drop = dropdown.current.getBoundingClientRect();
		const parent = container.current.getBoundingClientRect();

		let x = parent.x;
		let y = parent.y + parent.height;

		// Right aligned
		if (x + drop.width > window.innerWidth) {
			x = parent.x - drop.width + parent.width;
		}

		// Top aligned
		if (y + drop.height > window.innerHeight) {
			y = parent.y - drop.height;
		}

		setPos({ x, y });
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
	}, [isVisible]);

	return (
		<BlurContainer
			element={{ slug: 'button' }}
			onClick={handleClick}
			onBlur={() => setVisibility(false)}
			className={className || ''}
			style={{ ...style, position: 'relative' }}
			_ref={container}
		>
			{children}

			<Dropdown
				title={title}
				items={dropdownItems}
				isShown={isVisible}
				pos={pos}
				showSelected={false}
				_ref={dropdown}
				noPadding={noPadding}
			/>
		</BlurContainer>
	);
}
