'use client';

import { getCurrentSession, SessionValidationResult } from '@/actions/auth';
import { createContext, ReactNode, useEffect, useState } from 'react';

const initialSession: SessionValidationResult = {
	session: null,
	user: null,
} as const;

export const SessionContext =
	createContext<SessionValidationResult>(initialSession);

interface SessionProviderProps {
	children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
	const [session, setSession] =
		useState<SessionValidationResult>(initialSession);

	useEffect(() => {
		getCurrentSession().then((session) => setSession(session));
	}, []);

	return (
		<SessionContext.Provider value={session}>
			{children}
		</SessionContext.Provider>
	);
}
