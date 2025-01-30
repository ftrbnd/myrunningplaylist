import { auth } from '@/lib/auth';
import { getAccessToken, getPlaylists } from '@/services/spotify';
import PlaylistCard from './playlist-card';
import { headers } from 'next/headers';

export default async function PlaylistCollection() {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});
	const token = await getAccessToken({ userId: session?.user.id });
	const { playlists } = await getPlaylists({ token });

	return (
		<ul className='flex flex-col md:grid md:grid-cols-2 gap-2'>
			{playlists?.length === 0 ? (
				<p>No playlists found.</p>
			) : (
				playlists?.map((playlist) => (
					<li
						key={playlist.id}
						className='h-full'>
						<PlaylistCard playlist={playlist} />
					</li>
				))
			)}
		</ul>
	);
}
