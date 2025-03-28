import { spotify } from '@/lib/auth/spotify';
import { generateState } from 'arctic';
import { cookies } from 'next/headers';

export async function GET(): Promise<Response> {
	const state = generateState();
	const scopes = [
		'playlist-read-private',
		'playlist-modify-public',
		'playlist-modify-private',
	];
	const url = spotify.createAuthorizationURL(state, null, scopes);

	const cookieStore = await cookies();
	cookieStore.set('spotify_oauth_state', state, {
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
}
