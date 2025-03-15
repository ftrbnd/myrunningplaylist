import { getPlaylist } from '@/services/spotify';
import { getQueryClient } from '@/providers/get-query-client';
import { PlaylistDetails } from '@/components/playlists/playlist-details';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getCurrentSession } from '@/actions/auth';

interface Props {
	params: Promise<{ playlistId: string }>;
}

export default async function Page({ params }: Props) {
	const playlistId = (await params).playlistId;

	const session = await getCurrentSession();

	const queryClient = getQueryClient();
	queryClient.prefetchQuery({
		queryKey: ['playlists', playlistId],
		queryFn: () =>
			getPlaylist({
				token: session?.session?.id,
				id: playlistId,
			}),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PlaylistDetails id={playlistId} />
		</HydrationBoundary>
	);
}
