import { Link, Outlet, useParams } from 'react-router-dom';

import Head from '../../../components/Head';

export default function Hosts() {
	const params = useParams();

	return (
		<>
			<Head>
				<title>Profile settings</title>
			</Head>

			{params._id ? <Outlet /> : <h1>Hosts</h1>}
		</>
	);
}
