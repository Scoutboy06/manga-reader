import { Model, Schema, model, models } from 'mongoose';
import { VerificationToken } from 'next-auth/adapters';

// This model is currently not used, as it is only used for email authentication
const VerificationTokenSchema = new Schema<VerificationToken>({
	identifier: { type: String, required: true },
	expires: { type: Date, required: true },
	token: { type: String, required: true },
});

const Token = (models.VerificationToken ||
	model(
		'VerificationToken',
		VerificationTokenSchema,
		'users'
	)) as Model<VerificationToken>;

export default Token;
