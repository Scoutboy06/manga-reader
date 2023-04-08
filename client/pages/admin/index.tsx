import styles from './admin.module.css';
import Head from 'next/head';
import adminServerSideProps from '@/lib/adminServerSideProps';
import AdminLayout from '@/components/layouts/AdminLayout';

export default function Admin({ user }) {
	return (
		<>
			<Head>
				<title>Settings - General</title>
			</Head>

			<AdminLayout>
				<h1>General</h1>
			</AdminLayout>
		</>
	);
}

export const getServerSideProps = adminServerSideProps;
