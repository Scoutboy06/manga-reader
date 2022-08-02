import { NavLink } from 'react-router-dom';

import styles from './Navbar.module.css';

export default function Navbar({ children }) {
	return (
		<nav className={styles.navbar}>
			{children.map((NavEl, i) => (
				<NavLink
					key={'NavEl_' + i}
					to={NavEl.props.href}
					className={styles.navlink}
				>
					{NavEl.props.children}
				</NavLink>
			))}
		</nav>
	);
}
