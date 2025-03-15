'use server';

import { db } from '@/lib/db';
import { User, Session, sessions, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { updateAccessTokens } from '@/actions/users';
import * as spotify from '@/services/spotify';
import { redirect } from 'next/navigation';

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export async function createSession(
	token: string,
	userId: string
): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
	};
	await db.insert(sessions).values(session);
	return session;
}

export async function validateSessionToken(
	token: string
): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const userSessions = await db
		.select({ user: users, session: sessions })
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId));
	if (userSessions.length < 1) {
		return { session: null, user: null };
	}

	const { user, session } = userSessions[0];

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		// 15 days
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessions)
			.set({
				expiresAt: session.expiresAt,
			})
			.where(eq(sessions.id, session.id));
	}

	const tokens = await spotify.refreshAccessToken(user.refreshToken);
	await updateAccessTokens(user.id, tokens);

	return { session, user };
}

export async function setSessionTokenCookie(
	token: string,
	expiresAt: Date
): Promise<void> {
	(await cookies()).set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: expiresAt,
		path: '/',
	});
}

export async function deleteSessionTokenCookie(): Promise<void> {
	(await cookies()).set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 0,
		path: '/',
	});
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export const getCurrentSession = cache(
	async (): Promise<SessionValidationResult> => {
		const token = (await cookies()).get('session')?.value ?? null;
		if (token === null) {
			return { session: null, user: null };
		}
		const result = await validateSessionToken(token);
		return result;
	}
);

export async function logout() {
	const { session } = await getCurrentSession();
	if (!session) {
		return {
			error: 'Unauthorized',
		};
	}

	await invalidateSession(session.id);
	deleteSessionTokenCookie();

	return redirect('/login');
}
