import NextAuth from 'next-auth/next';
import { JWT } from 'next-auth/jwt';
import IUser from './User';

declare module 'next-auth' {
	interface Session {
		user: IUser;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		_id?: string;
	}
}
