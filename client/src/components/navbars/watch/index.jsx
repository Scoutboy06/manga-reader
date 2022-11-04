import { Link, useLocation } from 'react-router-dom';

import globstyles from '../navbar.module.css';

export default function Navbar() {
	const location = useLocation();
	const path = location.pathname.slice(1).split('/');

	return (
		<nav
			className={[globstyles.navbar].join(' ')}
			style={{ position: 'unset' }}
		>
			<div className={globstyles.buttonContainer}>
				<Link
					to={`/${path.slice(0, path.length - 1).join('/')}`}
					className={globstyles.button}
				>
					<i className='icon' style={{ fontSize: 28 }}>
						chevron_left
					</i>
				</Link>
				<Link to={`/${path[0]}`} className={globstyles.button}>
					<i className='icon'>home</i>
				</Link>
			</div>

			<div className={globstyles.buttonContainer}>
				<button className={globstyles.button}>
					<i className='icon'>search</i>
				</button>
			</div>
		</nav>
	);
}
