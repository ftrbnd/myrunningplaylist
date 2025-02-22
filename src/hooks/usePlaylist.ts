import { authClient } from '@/lib/auth-client';
import { getDuration } from '@/lib/utils';
import { getPlaylist } from '@/services/spotify';
import { useSuspenseQuery } from '@tanstack/react-query';

const QUERY_KEY = 'playlists' as const;
const { useSession } = authClient;

export function usePlaylist(playlistId: string) {
	const { data: session } = useSession();

	const {
		data: { playlist },
	} = useSuspenseQuery({
		queryKey: [QUERY_KEY, playlistId],
		queryFn: () =>
			getPlaylist({
				token: session?.account.accessToken,
				id: playlistId,
			}),
	});

	const runtimeMs = playlist.tracks.items.reduce(
		(prev, cur) => prev + cur.track.duration_ms,
		0
	);
	const duration = getDuration(runtimeMs);

	return {
		playlist,
		duration,
	};
}
