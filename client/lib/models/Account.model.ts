import { Model, Schema, model, models } from 'mongoose';
import { AdapterAccount } from 'next-auth/adapters';

const AccountSchema = new Schema<AdapterAccount>({
	access_token: String,
	token_type: String,
	id_token: String,
	refresh_token: String,
	scope: String,

	expires_at: Number,
	session_state: String,

	providerAccountId: { type: String, required: true },
	userId: { type: String, required: true },
	provider: { type: String, required: true },
	type: { type: String, enum: ['oauth', 'email', 'credentials'] },
});

const Account = (models.Account ||
	model('Account', AccountSchema, 'accounts')) as Model<AdapterAccount>;

export default Account;
