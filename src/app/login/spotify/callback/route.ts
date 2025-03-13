import { cookies } from 'next/headers';

import {
	ArcticFetchError,
	OAuth2RequestError,
	type OAuth2Tokens,
} from 'arctic';
import { spotify } from '@/lib/auth/spotify';
import { getCurrentUser } from '@/services/spotify';
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
} from '@/lib/auth/session';
import { createUser, getUserFromSpotifyId } from '@/lib/db/queries';

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

	const { user } = await getCurrentUser({
		token: tokens.accessToken(),
	});
	const spotifyUserId = user.id;
	const spotifyUsername = user.display_name;
	const spotifyImages = user.images;

	const existingUser = await getUserFromSpotifyId(spotifyUserId);
	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		await setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		});
	}

	const newUser = await createUser(
		spotifyUserId,
		spotifyUsername,
		spotifyImages.map((img) => img.url)
	);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, newUser.id);
	setSessionTokenCookie(sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/',
		},
	});
}
