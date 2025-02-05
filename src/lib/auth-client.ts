import { createAuthClient } from 'better-auth/react';
import { customSessionClient } from 'better-auth/client/plugins';
import type { auth } from '@/lib/auth';

export const authClient = createAuthClient({
	baseURL: 'http://localhost:3000', // the base url of your auth server
	plugins: [customSessionClient<typeof auth>()],
});

export const signIn = async () => {
	const data = await authClient.signIn.social({
		provider: 'spotify',
	});

	return data;
};
