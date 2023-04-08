import { authOptions } from '@/api/auth/[...nextauth]';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';

const adminServerSideProps: GetServerSideProps = async context => {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session?.user?.isAdmin) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			user: JSON.parse(JSON.stringify(session.user)),
		},
	};
};

export default adminServerSideProps;
