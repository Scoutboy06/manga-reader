import { useState } from 'react';

import BlurContainer from '../BlurContainer';
import Dropdown from '../Dropdown';

import styles from './index.module.css';

export default function Select({ children, onChange }) {
	const [selectedValue, setSelectedValue] = useState({
		display: '100%',
		value: '100',
	});
	const [isOpen, setIsOpen] = useState(false);

	const selectHandler = value => {
		if (onChange) onChange(value);
		setSelectedValue(value);
	};

	return (
		<BlurContainer
			className={styles.container + (isOpen ? ' open' : '')}
			onClick={() => setIsOpen(isOpen => !isOpen)}
			onBlur={() => setIsOpen(false)}
		>
			<span>{selectedValue.display}</span>

			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
			>
				<path d='M0 0h24v24H0z' fill='none' />
				<path d='M7 10l5 5 5-5z' />
			</svg>

			<Dropdown
				size='small'
				pos={{ x: 0, y: 40 }}
				isShown={isOpen}
				items={(children || []).map(item => {
					if (item.type === 'hr') return 'divider';
					if (item.type === 'option')
						return {
							content: item.props.children,
							disabled: item.props.disabled,
							action: () =>
								selectHandler({
									display: item.props.children,
									value: item.props.value,
								}),
						};
					return null;
				})}
			/>
		</BlurContainer>
	);
}
