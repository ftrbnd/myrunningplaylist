import Logout from '@/components/auth/logout';
import PlaylistCollection from '@/components/playlists/playlist-collection';

export default function Home() {
	return (
		<div className='w-full max-w-sm md:max-w-3xl'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
					My Running Playlist
				</h1>
				<Logout />
			</div>

			<PlaylistCollection />
		</div>
	);
}
