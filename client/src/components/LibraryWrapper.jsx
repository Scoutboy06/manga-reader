import { Outlet } from 'react-router-dom';

import Navbar from './navbars/Library';

export default function LibraryWrapper() {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}
