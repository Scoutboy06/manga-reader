import { NavLink } from 'react-router-dom';

import styles from './Navbar.module.css';

export default function Navbar({ children, className }) {
	return (
		<nav className={styles.navbar + (className ? ' ' + className : '')}>
			{children.map((el, i) => (
				<NavLink
					key={'NavLink_' + i}
					to={el.props.href}
					className={styles.navlink}
				>
					{el.props.children}
				</NavLink>
			))}
		</nav>
	);
}
