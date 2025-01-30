import Login from '@/components/auth/login';
import Logout from '@/components/auth/logout';
import PlaylistCollection from '@/components/playlists/playlist-collection';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Suspense } from 'react';

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});

	return (
		<div className='w-full max-w-sm md:max-w-3xl'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
					My Running Playlist
				</h1>
				{session?.session ? (
					<div>
						<p>Hello, {session.user.name}</p>
						<Logout />
						<Suspense fallback={<div>loading playlists...</div>}>
							<PlaylistCollection />
						</Suspense>
					</div>
				) : (
					<Login />
				)}
			</div>
		</div>
	);
}
