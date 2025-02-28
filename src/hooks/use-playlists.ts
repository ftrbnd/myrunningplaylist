import { authClient } from '@/lib/auth-client';
import { PLAYLISTS_QUERY_KEY } from '@/providers/get-query-client';
import { getPlaylists } from '@/services/spotify';
import { useSuspenseQuery } from '@tanstack/react-query';

const { useSession } = authClient;

export function usePlaylists() {
	const { data: session } = useSession();

	const {
		data: { playlists },
	} = useSuspenseQuery({
		queryKey: [PLAYLISTS_QUERY_KEY],
		queryFn: () =>
			getPlaylists({
				token: session?.account.accessToken,
				spotifyUserId: session?.account.accountId,
			}),
	});

	return { playlists };
}
