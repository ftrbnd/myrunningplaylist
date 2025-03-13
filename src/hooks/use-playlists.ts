import { PLAYLISTS_QUERY_KEY } from '@/providers/get-query-client';
import { getPlaylists } from '@/services/spotify';
import { useSuspenseQuery } from '@tanstack/react-query';

// TODO: replace
function useSession() {
	return {
		session: {
			account: {
				accessToken: 'faketoken',
				accountId: 'fakeid',
			},
		},
	};
}

export function usePlaylists() {
	const { session } = useSession();

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
