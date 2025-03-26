import { UserTokens } from '@/lib/db/schema';
import { createFetch } from '@better-fetch/fetch';
import { Page, Playlist, Track, UserProfile } from '@spotify/web-api-ts-sdk';
import * as encoding from '@oslojs/encoding';
import { generateRandomString, RandomReader } from '@oslojs/crypto/random';
import { getCurrentSession } from '@/actions/auth';
import { webcrypto } from 'node:crypto';

export const $spotify = createFetch({
	baseURL: 'https://api.spotify.com/v1',
	retry: {
		type: 'linear',
		attempts: 3,
		delay: 1000,
	},
	plugins: [
		{
			id: 'get-current-session',
			name: 'Get Current Session',
			init: async (url, options) => {
				await getCurrentSession();
				return { url, options };
			},
		},
	],
	onError: (e) => {
		if (e.error.status === 401) throw new Error('Spotify token expired');
	},
	throw: true,
});

export async function refreshAccessToken(
	refreshToken: string
): Promise<UserTokens> {
	const body = new URLSearchParams();
	body.set('grant_type', 'refresh_token');
	body.set('refresh_token', refreshToken);

	const bytes = new TextEncoder().encode(
		`${process.env.SPOTIFY_CLIENT_ID!}:${process.env.SPOTIFY_CLIENT_SECRET!}`
	);
	const credentials = encoding.encodeBase64(bytes);

	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
			Authorization: `Basic ${credentials}`,
		},
		body,
	});

	const data = await res.json();
	const tokens: UserTokens = {
		accessToken: data.access_token,
		accessTokenExpiresAt: new Date(new Date().getTime() + 3600 * 1000),
		refreshToken: data.refresh_token ?? refreshToken,
	};

	return tokens;
}

export async function getCurrentUser({ token }: { token?: string | null }) {
	if (!token) throw new Error('Spotify access token is required');

	const user = await $spotify<UserProfile>('/me', {
		auth: {
			type: 'Bearer',
			token,
		},
	});

	return { user };
}

export async function getPlaylists({
	token,
	spotifyUserId,
	previousUrl,
	nextUrl,
}: {
	token?: string | null;
	spotifyUserId?: string;
	previousUrl?: string | null;
	nextUrl?: string | null;
}) {
	if (!token || !spotifyUserId)
		throw new Error('Spotify access token and user id are both required');

	const prevUrlPath = previousUrl?.split('v1')[1];
	const nextUrlPath = nextUrl?.split('v1')[1];

	const playlists = await $spotify<Page<Playlist>>(
		nextUrlPath ?? prevUrlPath ?? `/me/playlists?limit=50`,
		{
			auth: {
				type: 'Bearer',
				token,
			},
		}
	);

	const userPlaylists = playlists.items.filter(
		(p) => p.owner.id === spotifyUserId
	);

	// const sortedPlaylists = userPlaylists?.sort((a, b) => {
	// 	const mostRecentlyAddedTrackFromA = a.tracks.items?.reduce((a, b) => {
	// 		const addedAtA = new Date(a.added_at);
	// 		const addedAtB = new Date(b.added_at);
	// 		return addedAtA > addedAtB ? a : b;
	// 	});

	// 	const mostRecentlyAddedTrackFromB = b.tracks.items?.reduce((a, b) => {
	// 		const addedAtA = new Date(a.added_at);
	// 		const addedAtB = new Date(b.added_at);
	// 		return addedAtA > addedAtB ? a : b;
	// 	});

	// 	return (
	// 		new Date(mostRecentlyAddedTrackFromA?.added_at).getTime() -
	// 		new Date(mostRecentlyAddedTrackFromB?.added_at).getTime()
	// 	);
	// });

	return {
		playlists: userPlaylists,
		previousUrl: playlists.previous,
		nextUrl: playlists.next,
	};
}

const random: RandomReader = {
	read(bytes: Uint8Array): void {
		webcrypto.getRandomValues(bytes);
	},
};
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export async function getPlaylist({
	token,
	id,
}: {
	token?: string | null;
	id?: string;
}) {
	if (!token || !id)
		throw new Error('Access token and playlist id are required');

	const playlist = await $spotify<Playlist<Track>>(`/playlists/${id}`, {
		auth: {
			type: 'Bearer',
			token,
		},
	});

	return {
		playlist: {
			...playlist,
			tracks: {
				...playlist.tracks,
				items: [
					...playlist.tracks.items.map((t) => {
						return {
							...t,
							track: {
								...t.track,
								id: `${t.track.id}:${generateRandomString(
									random,
									alphabet,
									5
								)}`,
							},
						};
					}),
				],
			},
		},
	};
}

export async function reorderPlaylist({
	token,
	playlist,
	rangeStart,
	insertBefore,
	rangeLength,
}: {
	token?: string | null;
	playlist: Playlist<Track>;
	rangeStart: number;
	insertBefore: number;
	rangeLength: number;
}) {
	if (!token) throw new Error('Access token is required');

	const res = await $spotify<{ snapshot_id: string }>(
		`/playlists/${playlist.id}/tracks`,
		{
			auth: {
				type: 'Bearer',
				token,
			},
			method: 'PUT',
			body: {
				range_start: rangeStart,
				insert_before: insertBefore,
				range_length: rangeLength,
				snapshot_id: playlist.snapshot_id,
			},
		}
	);

	return res;
}

export async function removeTracksFromPlaylist({
	token,
	playlistId,
	trackUris,
}: {
	token?: string | null;
	playlistId: string;
	trackUris: string[];
}) {
	if (!token) throw new Error('Access token is required');

	const res = await $spotify<{ snapshot_id: string }>(
		`/playlists/${playlistId}/tracks`,
		{
			auth: {
				type: 'Bearer',
				token,
			},
			method: 'DELETE',
			body: {
				tracks: trackUris.map((uri) => {
					return { uri };
				}),
			},
		}
	);

	return res;
}
