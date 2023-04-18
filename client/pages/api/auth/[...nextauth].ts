import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import MongooseAdapter from '@/lib/MongooseAdapter';

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
		}),
	],
	session: {
		strategy: 'database',
	},
	adapter: MongooseAdapter(),
	callbacks: {
		async session({ session, user }) {
			session.user = user;
			return session;
		},
	},
};

export default NextAuth(authOptions);
