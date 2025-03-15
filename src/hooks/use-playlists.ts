import { PLAYLISTS_QUERY_KEY } from '@/providers/get-query-client';
import { getPlaylists } from '@/services/spotify';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSession } from '@/hooks/use-session';

export function usePlaylists() {
	const session = useSession();

	const {
		data: { playlists },
	} = useSuspenseQuery({
		queryKey: [PLAYLISTS_QUERY_KEY],
		queryFn: () =>
			getPlaylists({
				token: session.user?.accessToken,
				spotifyUserId: session.user?.spotifyId,
			}),
	});

	return { playlists };
}
