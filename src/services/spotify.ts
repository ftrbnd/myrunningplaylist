import { createFetch } from '@better-fetch/fetch';
import { Page, Playlist, Track } from '@spotify/web-api-ts-sdk';

export const $spotify = createFetch({
	baseURL: 'https://api.spotify.com/v1',
	retry: {
		type: 'linear',
		attempts: 3,
		delay: 1000,
	},
	onError: (e) => {
		if (e.error.status === 401) throw new Error('Spotify token expired');
	},
	throw: true,
});

export async function getPlaylists({
	token,
	spotifyUserId,
}: {
	token?: string | null;
	spotifyUserId?: string;
}) {
	if (!token || !spotifyUserId)
		throw new Error('Spotify access token and user id are both required');

	const playlists = await $spotify<Page<Playlist>>('/me/playlists?limit=50', {
		auth: {
			type: 'Bearer',
			token,
		},
	});

	return {
		playlists: playlists?.items.filter((p) => p.owner.id === spotifyUserId),
	};
}

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

	return { playlist };
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

// TODO: fix 502 bad gateway response?
export async function removeTracksFromPlaylist({
	token,
	playlist,
	trackUris,
}: {
	token?: string | null;
	playlist: Playlist<Track>;
	trackUris: string[];
}) {
	if (!token) throw new Error('Access token is required');

	const tracks = trackUris.map((uri) => {
		return { uri };
	});

	const res = await $spotify<{ snapshot_id: string }>(
		`/playlists/${playlist.id}/tracks`,
		{
			auth: {
				type: 'Bearer',
				token,
			},
			method: 'DELETE',
			body: {
				tracks,
				snapshot_id: playlist.snapshot_id,
			},
		}
	);

	return res;
}
