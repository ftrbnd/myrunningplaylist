import { authClient } from '@/lib/auth-client';
import { getPlaylists } from '@/services/spotify';
import { useSuspenseQuery } from '@tanstack/react-query';

const QUERY_KEY = 'playlists' as const;
const { useSession } = authClient;

export function usePlaylists() {
	const { data: session } = useSession();

	const {
		data: { playlists },
	} = useSuspenseQuery({
		queryKey: [QUERY_KEY],
		queryFn: () =>
			getPlaylists({
				token: session?.account.accessToken,
				spotifyUserId: session?.account.accountId,
			}),
	});

	return { playlists };
}
