import type { Adapter } from 'next-auth/adapters';
import connectDB from '@/lib/mongoose';
import User from '@/models/User.model';
import Account from '@/models/Account.model';
import Session from '@/models/Session.model';
// import Token from '@/models/Token.model'; // Only used for email authentication

export default function MongooseAdapter(): Adapter {
	return {
		async createUser(user) {
			await connectDB();
			return User.create(user);
		},
		async getUser(id) {
			await connectDB();
			return User.findById(id, { mangas: 0, notifications: 0 });
		},
		async getUserByEmail(email) {
			await connectDB();
			return User.findOne({ email }, { mangas: 0, notifications: 0 });
		},
		async getUserByAccount({ providerAccountId, provider }) {
			await connectDB();
			const account = await Account.findOne({ providerAccountId, provider });
			if (!account) return null;
			return User.findById(account.userId, { mangas: 0, notifications: 0 });
		},
		async updateUser({ id, ...data }) {
			await connectDB();
			const user = await User.findOneAndUpdate(
				{ _id: id },
				{ $set: data },
				{ new: true, runValidators: true }
			);
			return user!;
		},
		async linkAccount(data) {
			await connectDB();
			await Account.create(data);
			// return; // TODO: fix return value
		},
		async createSession(data) {
			await connectDB();
			return Session.create(data);
		},
		async getSessionAndUser(sessionToken) {
			await connectDB();
			const session = await Session.findOne({ sessionToken });
			if (!session) return null;

			const user = await User.findById(session.userId, {
				mangas: 0,
				notifications: 0,
			});
			if (!user) return null;

			return {
				user: user.toObject(),
				session: session.toObject(),
			};
		},
		async updateSession({ sessionToken }) {
			await connectDB();
			const result = await Session.findOneAndUpdate(
				{ sessionToken },
				{ $set: { sessionToken } },
				{ returnDocument: 'after' }
			);
			if (!result) return null;

			return result;
		},
		async deleteSession(sessionToken) {
			await connectDB();
			const session = await Session.findOneAndDelete({ sessionToken });
			return session;
		},
		// These methods will be required in a future next-auth
		// release, but are not yet invoked:

		// async unlinkAccount({ providerAccountId, provider }) {
		// 	await connectDB();
		// },
		// async deleteUser(userId) {
		// 	await connectDB();
		// 	await Promise.all([
		// 		Account.deleteMany({ userId }),
		// 		Session.deleteMany({ userId }),
		// 		User.deleteOne({ _id: userId }),
		// 	]);
		// },
	};
}
