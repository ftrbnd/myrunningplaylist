import { db } from '@/lib/db';
import { users } from './schema';
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

export async function createUser(
	spotifyId: string,
	displayName: string,
	avatar?: string[]
) {
	const random: RandomReader = {
		read(bytes) {
			crypto.getRandomValues(bytes);
		},
	};
	const alphabet = '1234567890abcdefghijklmnopqrstuvwxyz';
	const id = generateRandomString(random, alphabet, 15);

	const user = await db
		.insert(users)
		.values({
			id,
			spotifyId,
			displayName,
			avatar,
		})
		.returning();

	return user[0];
}
