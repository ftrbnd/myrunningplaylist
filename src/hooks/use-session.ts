import { SessionContext } from '@/providers/session-provider';
import { useContext } from 'react';

export function useSession() {
	const context = useContext(SessionContext);
	if (process.env.NODE_ENV !== 'production' && !context) {
		throw new Error('useSession must be wrapped in a <SessionProvider />');
	}

	return context;
}
