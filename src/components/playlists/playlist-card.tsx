import { Playlist, TrackItem } from '@spotify/web-api-ts-sdk';
import Link from 'next/link';
import { ImageThumbnail } from '@/components/playlists/image-thumbnail';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
	playlist: Playlist<TrackItem>;
}

export default function PlaylistCard({ playlist }: Props) {
	return (
		<Link
			href={`/${playlist.id}`}
			prefetch>
			<AnimatePresence>
				<motion.div
					className='playlist-card'
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0 }}
					whileHover={{ scale: 0.95 }}
					whileFocus={{ opacity: 0.5 }}
					whileTap={{ scale: 1.05 }}>
					<ImageThumbnail
						images={playlist.images}
						className='h-24 w-24 md:h-full md:w-full rounded-md aspect-square'
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
				</motion.div>
			</AnimatePresence>
		</Link>
	);
}
