import { Outlet } from 'react-router-dom';

import Navbar from '../../components/navbars/Library';

export default function Library() {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}
