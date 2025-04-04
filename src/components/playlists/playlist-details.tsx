'use client';

import { durationDescription } from '@/lib/duration';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlaylistTracks } from '@/components/playlists/playlist-tracks';
import { RaceForm } from '@/components/playlists/race-form';
import { usePlaylist } from '@/hooks/use-playlist';
import { MotionEditingToast } from '@/components/playlists/editing-toast';
import { AnimatePresence, motion } from 'motion/react';
import { RaceMarkers } from '@/components/playlists/race-markers';
import { ImageThumbnail } from '@/components/playlists/image-thumbnail';
import { useEditPlaylist } from '@/hooks/use-edit-playlist';
import { useLayoutEffect, useRef, useState } from 'react';

interface Props {
	id: string;
}

export function PlaylistDetails({ id }: Props) {
	const { playlist } = usePlaylist(id);
	const { duration, tracksAreReordered, pace, store } = useEditPlaylist(id);

	const [isOverflowing, setIsOverflowing] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (ref.current) {
			const overflow = ref.current.scrollHeight > ref.current.clientHeight;

			setIsOverflowing(overflow);
		}
	}, [store.race]);

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='flex flex-col md:flex-row gap-2 justify-between items-center w-full mb-2'>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='flex gap-4 items-center  w-full md:w-auto overflow-hidden'>
					<ImageThumbnail
						images={playlist.images}
						className='h-24 w-24 rounded-md'
						alt={playlist.name}
					/>

					<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl line-clamp-2 overflow-visible'>
						{playlist.name}
					</h1>
				</motion.div>

				<p className='text-muted-foreground self-start md:self-center'>
					Total runtime: {durationDescription(duration)}
				</p>
			</motion.div>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='flex flex-col gap-2 md:grid md:grid-cols-2'>
				<Card
					className='h-min w-full md:w-min md:col-start-2 
				md:row-start-1 md:justify-self-end'>
					<CardHeader>
						<CardTitle className='scroll-m-20 text-xl font-semibold tracking-tight'>
							Select your race
						</CardTitle>
					</CardHeader>
					<CardContent>
						<RaceForm playlistId={id} />
					</CardContent>
				</Card>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='flex flex-col'>
					{pace && (
						<h2 className='text-2xl font-bold lg:text-3xl tracking-wider'>
							Pace <span className='text-primary'>{pace}</span>
						</h2>
					)}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						ref={ref}
						className='grid grid-flow-col md:gap-2 overflow-y-clip'>
						<PlaylistTracks
							playlistId={playlist.id}
							showOverflowWarning={isOverflowing}
						/>
						<RaceMarkers
							playlistId={playlist.id}
							className='place-self-end'
						/>
					</motion.div>
				</motion.div>
			</motion.div>
			<AnimatePresence initial={false}>
				{tracksAreReordered && (
					<MotionEditingToast
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0 }}
						transition={{
							delay: 0.1,
						}}
						playlistId={id}
					/>
				)}
			</AnimatePresence>
		</>
	);
}
