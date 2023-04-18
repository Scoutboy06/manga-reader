import NextAuth from 'next-auth';
import IUser from '@/types/User';

declare module 'next-auth' {
	interface Session {
		user: IUser;
	}
}
