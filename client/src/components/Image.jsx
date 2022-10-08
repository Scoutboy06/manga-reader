/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';

export default function Image({
	src: largeSrc,
	blur = 0,
	placeholder,
	style = {},
}) {
	const [src, setSrc] = useState(placeholder);

	useEffect(() => {
		const largeImg = new window.Image();
		largeImg.onload = () => {
			setSrc(largeSrc);
		};
		largeImg.setAttribute('src', largeSrc);
	}, [largeSrc]);

	return (
		<img
			src={src}
			style={{
				...style,
				filter: `blur(${src === placeholder ? blur : 0}px)`,
				transition: 'filter .6s',
			}}
		/>
	);
}
