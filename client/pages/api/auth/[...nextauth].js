import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
// import FacebookProvider from 'next-auth/providers/facebook';
// import Twitter from 'next-auth/providers/twitter';
// import AppleProvider from 'next-auth/providers/apple';


export const authOptions = {
	providers: [
		GoogleProvider.default({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		// FacebookProvider({
		// 	clientId: process.env.FACEBOOK_CLIENT_ID,
		// 	clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		// }),
		// TwitterProvider({
		// 	clientId: process.env.TWITTER_CLIENT_ID,
		// 	clientSecret: process.env.TWITTER_CLIENT_SECRET,
		// }),
		// AppleProvider({
		// 	clientId: process.env.APPLE_ID,
		// 	clientSecret: process.env.APPLE_SECRET,
		// }),
	],
	pages: {
		signIn: '/login'
	},
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		session: async ({ session, token }) => {
			if (session?.user) session.user.id = token.uid;
			return session;
		},
		jwt: async ({ user, token }) => {
			if (user) token.uid = user.id;
			return token;
		},
	},
};

export default NextAuth.default(authOptions);