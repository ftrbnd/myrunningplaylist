import { getCurrentSession } from '@/actions/auth';
import PlaylistCollection from '@/components/playlists/playlist-collection';
import {
	getQueryClient,
	PLAYLISTS_QUERY_KEY,
} from '@/providers/get-query-client';
import { getPlaylists } from '@/services/spotify';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function Home() {
	const { session, user } = await getCurrentSession();
	if (!session) return redirect('/login');

	const queryClient = getQueryClient();
	queryClient.prefetchQuery({
		queryKey: [PLAYLISTS_QUERY_KEY],
		queryFn: () =>
			getPlaylists({
				token: user.accessToken,
				spotifyUserId: user.spotifyId,
			}),
	});

	return (
		<div className='flex flex-col justify-center items-center self-center max-w-screen-xl'>
			<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 self-start'>
				My playlists
			</h1>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<PlaylistCollection />
			</HydrationBoundary>
		</div>
	);
}
