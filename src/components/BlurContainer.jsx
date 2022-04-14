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
			const path = e.composedPath();

			if (path.indexOf(_ref?.current || containerRef.current) === -1) {
				const shallRemoveListener = onBlur(e);

				if (shallRemoveListener === true) {
					window.removeEventListener('mousedown', checkBlurHandler);
					window.removeEventListener('touchstart', checkBlurHandler);
					hasMouseDownListener.current = false;
				}
			}
		}
	};

	useEffect(() => {
		return () => {
			window.removeEventListener('mousedown', checkBlurHandler);
			window.removeEventListener('touchstart', checkBlurHandler);
		};
	}, []);

	return (
		<element.slug
			ref={_ref || containerRef}
			onClick={e => {
				onClick(e);
				if (onBlur && !hasMouseDownListener.current) {
					window.addEventListener('mousedown', checkBlurHandler);
					window.addEventListener('touchstart', checkBlurHandler);
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
