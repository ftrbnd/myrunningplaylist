import { auth } from '@/lib/auth';
import { getPlaylist } from '@/services/spotify';
import { headers } from 'next/headers';
import { getQueryClient } from '@/providers/get-query-client';
import { PlaylistDetails } from '@/components/playlists/playlist-details';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

interface Props {
	params: Promise<{ playlistId: string }>;
}

export default async function Page({ params }: Props) {
	const playlistId = (await params).playlistId;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const queryClient = getQueryClient();
	queryClient.prefetchQuery({
		queryKey: ['playlists', playlistId],
		queryFn: () =>
			getPlaylist({
				token: session?.account.accessToken,
				id: playlistId,
			}),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PlaylistDetails id={playlistId} />
		</HydrationBoundary>
	);
}
