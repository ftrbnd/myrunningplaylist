'use client';

import { durationDescription } from '@/lib/duration';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlaylistTracks } from '@/components/playlists/playlist-tracks';
import { RaceForm } from '@/components/playlists/race-form';
import { usePlaylist } from '@/hooks/use-playlist';
import { MotionEditingToast } from '@/components/playlists/editing-toast';
import { AnimatePresence } from 'motion/react';
import { RaceMarkers } from '@/components/playlists/race-markers';
import { ImageThumbnail } from '@/components/playlists/image-thumbnail';
import { useEditPlaylist } from '@/hooks/use-edit-playlist';

interface Props {
	id: string;
}

export function PlaylistDetails({ id }: Props) {
	const { playlist } = usePlaylist(id);
	const { duration, tracksAreReordered } = useEditPlaylist(id);

	return (
		<>
			<div className='flex flex-col md:flex-row gap-2 justify-between items-center w-full mb-2'>
				<div className='flex gap-4 items-center w-full md:w-auto'>
					<ImageThumbnail
						images={playlist.images}
						className='h-24 w-24 rounded-md'
						alt={playlist.name}
					/>

					<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl line-clamp-2 overflow-visible'>
						{playlist.name}
					</h1>
				</div>

				<p className='text-muted-foreground self-start md:self-center'>
					Total runtime: {durationDescription(duration)}
				</p>
			</div>
			<div className='flex flex-col gap-2 md:grid md:grid-cols-2'>
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
				<div className='grid grid-flow-col md:gap-1'>
					<PlaylistTracks playlistId={playlist.id} />
					<RaceMarkers
						playlistId={playlist.id}
						className='place-self-end'
					/>
				</div>
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
			</div>
		</>
	);
}
