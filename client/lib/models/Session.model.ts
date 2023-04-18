import { Model, Schema, model, models } from 'mongoose';
import { AdapterSession } from 'next-auth/adapters';

const SessionSchema = new Schema<AdapterSession>({
	sessionToken: { type: String, required: true },
	userId: { type: String, required: true },
	expires: { type: Date, required: true },
});

const Session = (models.Session ||
	model('Session', SessionSchema, 'sessions')) as Model<AdapterSession>;

export default Session;
