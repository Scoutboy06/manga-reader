import { useEffect } from 'react';

export default function Head({ children }) {
	useEffect(() => {
		const selectors = {
			link: 'rel',
			meta: 'name',
		};

		for (const child of children.length ? children : [children]) {
			if (child.type === 'title') {
				document.head.querySelector('title').textContent = child.props.children;
				continue;
			}

			const elType = child.type;
			const selector = selectors[elType];
			const selProp = child.props[selector];
			let el;

			if (selProp)
				el = document.head.querySelector(`${elType}[${selector}='${selProp}']`);
			if (!el) {
				el = document.createElement(elType);
				el.setAttribute(selector, selProp);
				document.head.appendChild(el);
			}

			for (const propKey of Object.keys(child.props)) {
				if (propKey === selector) continue;
				el.setAttribute(propKey, child.props[propKey]);
			}
		}
	}, [children]);

	return null;
}
