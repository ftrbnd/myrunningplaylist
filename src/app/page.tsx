import Login from '@/components/auth/login';
import PlaylistCollection from '@/components/playlists/playlist-collection';
import PlaylistSkeletonCards from '@/components/playlists/skeletons';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Suspense } from 'react';

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});

	if (!session?.session) return <Login />;

	return (
		<div className='flex flex-col justify-between items-center'>
			<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4'>
				Hello, {session.user.name}
			</h1>
			<Suspense fallback={<PlaylistSkeletonCards />}>
				<PlaylistCollection />
			</Suspense>
		</div>
	);
}
