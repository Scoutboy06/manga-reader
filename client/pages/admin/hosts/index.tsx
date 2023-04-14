import Head from 'next/head';
import styles from './hosts.module.css';
import AdminLayout from '@/components/layouts/AdminLayout';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]';
import IUser from '@/types/User';
import Host from '@/models/Host.model';

type PageProps = {
	user: IUser;
	totalHosts: number;
};

export default function Hosts({ user, totalHosts }: PageProps) {
	return (
		<>
			<Head>
				<title>Settings - Hosts</title>
			</Head>

			<AdminLayout
				top={
					<>
						<h1>Hosts</h1>
						<Link href='/admin/hosts/new' className='btn btn-primary icon-left'>
							<i className='icon'>add</i>
							Create new
						</Link>
					</>
				}
			>
				<div className={styles.infoCards}>
					<div className={styles.infoCard}>
						<h1>{totalHosts}</h1>
						<p>Total hosts</p>
					</div>
				</div>
			</AdminLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async context => {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session?.user?.isAdmin) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const [totalHosts] = await Promise.all([Host.countDocuments({})]);

	const props: PageProps = {
		user: JSON.parse(JSON.stringify(session.user)),
		totalHosts,
	};

	return { props };
};
