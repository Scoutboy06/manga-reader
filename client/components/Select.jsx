import { useState, Children, useEffect, useRef } from 'react';

import styles from '@/components/Dropdown/Dropdown.module.css';

function Root({ children, ...props }) {
	const [isOpen, setIsOpen] = useState(false);
	const rootEl = useRef();

	const handleWindowClick = e => {
		const path = e.composedPath();

		if (!path.includes(rootEl.current)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('click', handleWindowClick);
		} else {
			window.removeEventListener('click', handleWindowClick);
		}

		return () => {
			window.removeEventListener('click', handleWindowClick);
		};
	}, [isOpen]);

	return (
		<div
			className={styles.container + (isOpen ? ' open' : '')}
			ref={rootEl}
			{...props}
		>
			{Children.map(children, (child, i) => {
				// Button
				if (child.type === Button) {
					return (
						<button
							key={`button_${i}`}
							{...child.props}
							onClick={() => {
								child.props.onClick?.();
								setIsOpen(!isOpen);
							}}
							className={[child.props.className, styles.button].join(' ')}
						>
							{child.props.children}
							<i className='icon'>arrow_drop_down</i>
						</button>
					);
				}

				// Options
				if (child.type === Options) {
					if (!isOpen) return null;

					return (
						<div
							className={[
								child.props.className,
								styles.dropdown,
								child.props.placement || 'bl',
							].join(' ')}
							key={`options_${i}`}
						>
							{child.props.options?.map((option, j) => {
								if (option.type === 'hr' || option === 'divider') {
									return (
										<div className={styles.divider} key={`divider_${j}`}></div>
									);
								}

								return (
									<div
										key={option.value}
										onClick={() =>
											child.props.onChange?.(option.value, option.label)
										}
										className={[
											option.className,
											styles.item,
											option.value === child.props.value ? 'selected' : '',
										].join(' ')}
										style={option.style}
									>
										{option.label}
									</div>
								);
							})}
						</div>
					);
				} else return child;
			})}
		</div>
	);
}

function Button() {
	return null;
}

function Options() {
	return null;
}

export default {
	Root,
	Button,
	Options,
};
