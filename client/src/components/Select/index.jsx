import { useState } from 'react';

import BlurContainer from '../BlurContainer';
import Dropdown from '../Dropdown';

import styles from './index.module.css';

export default function Select({ children, value, onChange }) {
	const [selectedValue, setSelectedValue] = useState({
		value,
		display: children.find(el => el.props.value === value)?.props?.children,
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
			element={{ slug: 'button' }}
		>
			<span>{selectedValue.display}</span>

			<i
				className='icon'
				style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
			>
				arrow_drop_down
			</i>

			<Dropdown
				size='small'
				pos={{ x: 0, y: 40 }}
				isShown={isOpen}
				showSelected={true}
				items={(children || []).map(item => {
					if (item.type === 'hr') return 'divider';
					if (item.type === 'option')
						return {
							content: item.props.children,
							disabled: item.props.disabled,
							default: item.props.default,
							action: () => {
								selectHandler({
									display: item.props.children,
									value: item.props.value,
								});
							},
						};
					return null;
				})}
			/>
		</BlurContainer>
	);
}
