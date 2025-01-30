import { db } from '@/db';
import { account } from '@/db/schema';
import { createFetch } from '@better-fetch/fetch';
import { Page, Playlist } from '@spotify/web-api-ts-sdk';
import { eq } from 'drizzle-orm';

export const $fetch = createFetch({
	baseURL: 'https://api.spotify.com/v1',
	retry: {
		type: 'linear',
		attempts: 3,
		delay: 1000,
	},
	throw: true,
});

export async function getAccessToken({ userId }: { userId?: string }) {
	if (!userId) throw new Error('User id is required');

	const accounts = await db
		.select()
		.from(account)
		.where(eq(account.userId, userId));

	if (accounts.length === 0)
		throw new Error('No account found with matching user id');

	return accounts[0].accessToken;
}

export async function getPlaylists({ token }: { token?: string | null }) {
	if (!token) throw new Error('Access token is required');

	const playlists = await $fetch<Page<Playlist>>('/me/playlists', {
		auth: {
			type: 'Bearer',
			token,
		},
	});

	return { playlists: playlists.items };
}
