import Head from 'next/head';
import styles from './users.module.css';
import adminServerSideProps from '@/lib/adminServerSideProps';
import AdminLayout from '@/layouts/AdminLayout';

export default function Users() {
	return (
		<>
			<Head>
				<title>Settings - Users</title>
			</Head>

			<AdminLayout>
				<h1>Users</h1>
			</AdminLayout>
		</>
	);
}

export const getServerSideProps = adminServerSideProps;
