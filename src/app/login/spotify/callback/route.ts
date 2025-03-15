import { cookies } from 'next/headers';

import {
	ArcticFetchError,
	OAuth2RequestError,
	type OAuth2Tokens,
} from 'arctic';
import { spotify } from '@/lib/auth/spotify';
import * as spotifyApi from '@/services/spotify';

import {
	createUser,
	getUserFromSpotifyId,
	updateAccessTokens,
} from '@/lib/db/queries';
import { generateSessionToken } from '@/lib/auth/session';
import { createSession, setSessionTokenCookie } from '@/actions/auth';

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState =
		(await cookies()).get('spotify_oauth_state')?.value ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400,
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await spotify.validateAuthorizationCode(code, null);

		const { user: spotifyUser } = await spotifyApi.getCurrentUser({
			token: tokens.accessToken(),
		});

		const existingUser = await getUserFromSpotifyId(spotifyUser.id);
		if (existingUser) {
			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, existingUser.id);
			await setSessionTokenCookie(sessionToken, session.expiresAt);

			await updateAccessTokens(existingUser.id, {
				accessToken: tokens.accessToken(),
				refreshToken: tokens.refreshToken(),
				accessTokenExpiresAt: tokens.accessTokenExpiresAt(),
			});

			return new Response(null, {
				status: 302,
				headers: {
					Location: '/',
				},
			});
		}

		const newUser = await createUser({
			spotifyId: spotifyUser.id,
			displayName: spotifyUser.display_name,
			avatar: spotifyUser.images.map((img) => img.url),
			accessToken: tokens.accessToken(),
			refreshToken: tokens.refreshToken(),
			accessTokenExpiresAt: tokens.accessTokenExpiresAt(),
		});

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, newUser.id);
		setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		});
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			// Invalid authorization code, credentials, or redirect URI
			return new Response(null, {
				status: 401,
				statusText: 'Unauthorized',
			});
		}
		if (e instanceof ArcticFetchError) {
			// Failed to call `fetch()`
			return new Response(null, {
				status: 500,
				statusText: 'Internal server error',
			});
		}

		// Invalid code or client credentials
		return new Response(null, {
			status: 400,
		});
	}
}
