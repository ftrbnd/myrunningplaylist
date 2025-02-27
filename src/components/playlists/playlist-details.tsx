'use client';

import { durationDescription } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlaylistTracks } from '@/components/playlists/playlist-tracks';
import { RaceForm } from '@/components/playlists/race-form';
import { usePlaylist } from '@/hooks/use-playlist';
import { EditingToast } from './editing-toast';

interface Props {
	id: string;
}

export function PlaylistDetails({ id }: Props) {
	const playlist = usePlaylist(id);

	return (
		<>
			<div className='flex justify-between items-center w-full'>
				<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4'>
					{playlist.original.name}
				</h1>

				<p className='text-muted-foreground'>
					Total runtime:{' '}
					{durationDescription(
						playlist.duration.seconds,
						playlist.duration.minutes,
						playlist.duration.hours
					)}
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
						<RaceForm />
					</CardContent>
				</Card>
				<PlaylistTracks playlistId={playlist.original.id} />
				{playlist.copyIsReordered && <EditingToast playlistId={id} />}
			</div>
		</>
	);
}
