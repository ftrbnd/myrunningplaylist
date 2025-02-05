import { createFetch } from '@better-fetch/fetch';
import { Page, Playlist, Track } from '@spotify/web-api-ts-sdk';

export const $fetch = createFetch({
	baseURL: 'https://api.spotify.com/v1',
	retry: {
		type: 'linear',
		attempts: 3,
		delay: 1000,
	},
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

	const { data: playlists, error } = await $fetch<Page<Playlist>>(
		'/me/playlists?limit=50',
		{
			auth: {
				type: 'Bearer',
				token,
			},
		}
	);

	if (error?.status === 401) throw new Error('Spotify token expired');
	if (error) throw error;

	return {
		playlists: playlists?.items.filter((p) => p.owner.id === spotifyUserId),
	};
}

export async function getPlaylist({
	token,
	id,
}: {
	token?: string | null;
	id: string;
}) {
	if (!token) throw new Error('Access token is required');

	const { data: playlist, error } = await $fetch<Playlist<Track>>(
		`/playlists/${id}`,
		{
			auth: {
				type: 'Bearer',
				token,
			},
		}
	);

	if (error?.status === 401) throw new Error('Spotify token expired');
	if (error) throw error;

	return { playlist };
}
