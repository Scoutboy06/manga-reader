import Head from 'next/head';
import styles from './hosts.module.css';
import adminServerSideProps from '@/lib/adminServerSideProps';
import AdminLayout from '@/components/layouts/AdminLayout';

export default function Hosts() {
	return (
		<>
			<Head>
				<title>Settings - Hosts</title>
			</Head>

			<AdminLayout>
				<h1>Hosts</h1>
			</AdminLayout>
		</>
	);
}

export const getServerSideProps = adminServerSideProps;
