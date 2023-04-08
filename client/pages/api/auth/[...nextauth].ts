import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import connectDB from '@/lib/mongodb';
import User from '@/lib/models/userModel';

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		session: async ({ session, token }) => {
			const user = await User.findOne(
				{ _id: token._id },
				{ mangas: 0, animes: 0 }
			);
			if (user) session.user = user;
			return session;
		},
		jwt: async ({ user, token }) => {
			if (user) token._id = user.id;
			return token;
		},
		async signIn({ user }) {
			await connectDB();
			// If the user doesn't exist, add it to the database
			await User.findOneAndUpdate(
				{ _id: user.id },
				{
					$setOnInsert: {
						email: user.email,
						image: user.image,
						name: user.name,
					},
				},
				{ upsert: true, new: true, setDefaultsOnInsert: true }
			);

			return true;
		},
	},
};

export default NextAuth(authOptions);
