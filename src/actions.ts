'use server';

import { redirect } from 'next/navigation';
import {
	getCurrentSession,
	invalidateSession,
	deleteSessionTokenCookie,
} from '@/lib/auth/session';

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
