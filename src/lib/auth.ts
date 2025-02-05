import { betterAuth } from 'better-auth';
import { customSession } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import { user, session, account, verification } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user,
			session,
			account,
			verification,
		},
	}),
	socialProviders: {
		spotify: {
			clientId: process.env.SPOTIFY_CLIENT_ID!,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
			scope: ['playlist-read-private'],
		},
	},
	plugins: [
		customSession(async ({ user, session }) => {
			const account = await getAccountDetails({ userId: user.id });
			return {
				user,
				session,
				account,
			};
		}),
	],
});

async function getAccountDetails({ userId }: { userId?: string }) {
	if (!userId) throw new Error('User id is required');

	const accounts = await db
		.select()
		.from(account)
		.where(eq(account.userId, userId));

	if (accounts.length === 0)
		throw new Error('No account found with matching user id');

	return accounts[0];
}
