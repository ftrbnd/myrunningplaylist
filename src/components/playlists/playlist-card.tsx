import { Playlist, TrackItem } from '@spotify/web-api-ts-sdk';
import Link from 'next/link';
import { ImageThumbnail } from '@/components/playlists/image-thumbnail';

interface Props {
	playlist: Playlist<TrackItem>;
}

export default function PlaylistCard({ playlist }: Props) {
	return (
		<Link
			href={`/${playlist.id}`}
			prefetch>
			<div className='playlist-card'>
				<ImageThumbnail
					images={playlist.images}
					className='h-24 w-24 md:h-full md:w-full rounded-md'
					alt={playlist.name}
				/>

				<div className='flex-1 space-y-1 md:text-center'>
					<p className='font-semibold leading-none hover:underline text-xl md:text-base'>
						{playlist.name}
					</p>
					<p className='text-muted-foreground text-lg md:text-sm'>
						{playlist.tracks.total} tracks
					</p>
				</div>
			</div>
		</Link>
	);
}
