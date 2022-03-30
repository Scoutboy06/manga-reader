import { useEffect } from 'react';

export default function Title({ children }) {
	useEffect(() => {
		document.title = children;
	}, [children]);

	return null;
}
