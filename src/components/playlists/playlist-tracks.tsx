'use client';

import { formattedDuration, getDuration } from '@/lib/utils';
import { Playlist, Track } from '@spotify/web-api-ts-sdk';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrackDetails from '@/components/playlists/track-details';

export function PlaylistTracks({ playlist }: { playlist: Playlist<Track> }) {
	const getStartingTimestamp = (trackIndex: number) => {
		const tracksBefore = playlist.tracks.items.filter((_, i) => i < trackIndex);
		const currentMs = tracksBefore.reduce(
			(prev, cur) => prev + cur.track.duration_ms,
			0
		);

		const { hours, minutes, seconds } = getDuration(currentMs);
		return formattedDuration(seconds, minutes, hours);
	};

	const runtimeMs = playlist.tracks.items.reduce(
		(prev, cur) => prev + cur.track.duration_ms,
		0
	);
	const { hours, minutes, seconds } = getDuration(runtimeMs);

	return (
		<ul className='flex flex-col gap-2 md:col-start-1 md:row-start-1'>
			{playlist.tracks.items.map(({ track }, i) => (
				<li
					key={`${track.id}-${i}`}
					className='flex flex-col gap-1'>
					<div className='flex gap-1'>
						{i === 0 ? (
							<Badge variant='green'>Start: 00:00</Badge>
						) : (
							<Badge variant='yellow'>{getStartingTimestamp(i)}</Badge>
						)}
					</div>
					<div className='flex gap-2 items-center'>
						<div className='grid grid-rows-2 gap-1'>
							<Button
								variant='outline'
								size='icon'>
								<ArrowUp />
							</Button>
							<Button
								variant='outline'
								size='icon'>
								<ArrowDown />
							</Button>
						</div>
						<TrackDetails
							track={track}
							className='flex-1'
						/>
					</div>
				</li>
			))}
			<li className='flex gap-1'>
				<Badge variant='destructive'>
					Finish: {formattedDuration(seconds, minutes, hours)}
				</Badge>
			</li>
		</ul>
	);
}
