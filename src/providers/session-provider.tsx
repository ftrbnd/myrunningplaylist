'use client';

import { SessionValidationResult } from '@/actions/auth';
import { createContext, ReactNode } from 'react';

const initialSession: SessionValidationResult = {
	session: null,
	user: null,
} as const;

export const SessionContext =
	createContext<SessionValidationResult>(initialSession);

interface SessionProviderProps {
	session: SessionValidationResult;
	children: ReactNode;
}

export function SessionProvider({ session, children }: SessionProviderProps) {
	return (
		<SessionContext.Provider value={session}>
			{children}
		</SessionContext.Provider>
	);
}
