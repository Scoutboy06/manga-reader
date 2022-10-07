import { useState } from 'react';

import BlurContainer from '../BlurContainer';

import styles from './Select.module.css';
import dropdownStyles from '../Dropdown/Dropdown.module.css';

export default function Select({
	children,
	defaultValue,
	onChange = () => {},
	size = '',
	containerText,
}) {
	const [selectedValue, setSelectedValue] = useState(defaultValue);
	const [isOpen, setIsOpen] = useState(false);

	const selectHandler = value => {
		onChange(value);
		setSelectedValue(value);
	};

	return (
		<BlurContainer
			className={styles.selectContainer + (isOpen ? ' open' : '')}
			onClick={() => setIsOpen(isOpen => !isOpen)}
			onBlur={() => setIsOpen(false)}
			element={{ slug: 'button' }}
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
					right: 0,
					bottom: -5,
					transform: 'translateY(100%)',
					fontFamily: 'var(--font-family)',
					position: 'absolute',
				}}
				onClick={e => e.preventDefault()}
			>
				{children.map((child, i) =>
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
