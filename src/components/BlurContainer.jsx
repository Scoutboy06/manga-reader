import { useEffect, useRef } from 'react';

export default function BlurContainer({
	children,
	onClick,
	onBlur,
	onContextMenu,
	className,
	_ref,
	element = { slug: 'div' },
}) {
	const containerRef = useRef();
	const hasMouseDownListener = useRef(false);

	const checkBlurHandler = e => {
		if (onBlur) {
			if (e.path.indexOf(_ref?.current || containerRef.current) === -1) {
				const shallRemoveListener = onBlur(e);
				if (shallRemoveListener !== true) {
					window.removeEventListener('mousedown', checkBlurHandler);
					hasMouseDownListener.current = false;
				}
			}
		}
	};

	useEffect(() => {
		return () => {
			window.removeEventListener('mousedown', checkBlurHandler);
		};
	}, []);

	return (
		<element.slug
			ref={_ref || containerRef}
			onClick={e => {
				onClick(e);
				if (onBlur && !hasMouseDownListener.current) {
					window.addEventListener('mousedown', checkBlurHandler);
					hasMouseDownListener.current = true;
				}
			}}
			className={className}
			onContextMenu={onContextMenu}
		>
			{children}
		</element.slug>
	);
}
