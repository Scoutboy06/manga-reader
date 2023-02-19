import { Link, Outlet, useParams } from 'react-router-dom';
import Head from 'next/head';

export default function Hosts() {
	const params = useParams();

	return (
		<>
			<Head>
				<title>Hosts settings</title>
			</Head>

			{params._id ? <Outlet /> : <h1>Hosts</h1>}
		</>
	);
}
