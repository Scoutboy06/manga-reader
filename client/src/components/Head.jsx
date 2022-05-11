import { useEffect } from 'react';

export default function Head({ children }) {
	useEffect(() => {
		if (!children) return;

		for (const child of children.length ? children : [children]) {
			if (child.type === 'title') {
				document.head.querySelector('title').textContent = child.props.children;
				continue;
			}

			const el = document.head.querySelector(`${child.type}#${child.props.id}`);

			if (!child.props.id || !el) {
				const createdEl = document.createElement(child.type);
				for (const elKey of Object.keys(child.props)) {
					if (elKey !== 'payload') {
						createdEl.setAttribute(elKey, child.props[elKey]);
					}
				}
				document.head.appendChild(createdEl);
				return;
			}

			// Assign all the element's props
			for (const key of Object.keys(child.props)) {
				el.setAttribute(key, child.props[key]);
			}
		}
	}, [children]);

	return null;
}
