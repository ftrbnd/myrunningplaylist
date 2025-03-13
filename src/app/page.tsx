import Login from '@/components/auth/login';
import PlaylistCollection from '@/components/playlists/playlist-collection';
import { getCurrentSession } from '@/lib/auth/session';
import { getQueryClient } from '@/providers/get-query-client';
import { getPlaylists } from '@/services/spotify';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function Home() {
	const session = await getCurrentSession();
	if (!session?.session) return <Login />;

	const queryClient = getQueryClient();
	queryClient.prefetchQuery({
		queryKey: ['playlists'],
		queryFn: () =>
			getPlaylists({
				token: session.session.id,
				spotifyUserId: session.session.userId.toString(),
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
