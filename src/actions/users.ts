import { db } from '@/lib/db';
import { NewUser, users, UserTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateRandomString, RandomReader } from '@oslojs/crypto/random';

export async function getUserFromSpotifyId(spotifyId: string) {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.spotifyId, spotifyId));
	if (!user || user.length === 0) return null;

	return user[0];
}

export async function createUser(newUser: NewUser) {
	const random: RandomReader = {
		read(bytes) {
			crypto.getRandomValues(bytes);
		},
	};
	const alphabet = '1234567890abcdefghijklmnopqrstuvwxyz';
	const id = generateRandomString(random, alphabet, 15);

	const user = await db
		.insert(users)
		.values({ id, ...newUser })
		.returning();

	return user[0];
}

export async function updateAccessTokens(userId: string, tokens: UserTokens) {
	const updatedUsers = await db
		.update(users)
		.set(tokens)
		.where(eq(users.id, userId))
		.returning();

	return updatedUsers[0];
}
