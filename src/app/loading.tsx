import { PlaylistSkeletons } from '@/components/playlists/playlist-skeletons';

export default function Loading() {
	return (
		<div className='flex flex-col justify-center items-center self-center max-w-screen-xl'>
			<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 self-start'>
				My playlists
			</h1>
			<PlaylistSkeletons />
		</div>
	);
}
