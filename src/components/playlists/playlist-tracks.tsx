'use client';

import { cn, formattedDuration, getDuration } from '@/lib/utils';
import { Track } from '@spotify/web-api-ts-sdk';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrackDetails from '@/components/playlists/track-details';
import { usePlaylist } from '@/hooks/usePlaylist';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuShortcut,
	ContextMenuTrigger,
	ContextMenuItem,
} from '@/components/ui/context-menu';

export function PlaylistTracks({ playlistId }: { playlistId: string }) {
	const playlist = usePlaylist(playlistId);

	const getStartingTimestamp = (trackIndex: number) => {
		const tracksBefore = playlist.copy.tracks.items.filter(
			(_, i) => i < trackIndex
		);
		const currentMs = tracksBefore.reduce(
			(prev, cur) => prev + cur.track.duration_ms,
			0
		);

		const { hours, minutes, seconds } = getDuration(currentMs);
		return formattedDuration(seconds, minutes, hours);
	};

	const trackIsOutOfOrder = (index: number, track: Track) => {
		const original = playlist.original.tracks.items.at(index)?.track;
		if (!original) return false;

		return original.uri !== track.uri;
	};

	const handleClick = (track: Track) => {
		playlist.removeTracks({ trackUris: [track.uri] });
	};

	return (
		<ul className='flex flex-col gap-2 md:col-start-1 md:row-start-1'>
			{playlist.copy.tracks.items.map(({ track }, index) => (
				<li
					key={`${track.id}-${index}`}
					className='flex flex-col gap-1'>
					<div className='flex gap-1'>
						{index === 0 ? (
							<Badge variant='green'>Start: 00:00</Badge>
						) : (
							<Badge variant='yellow'>{getStartingTimestamp(index)}</Badge>
						)}
					</div>
					<div className='flex gap-2 items-center'>
						<div className='grid grid-rows-2 gap-1'>
							<Button
								onClick={() => playlist.handleReorder(index, 'up')}
								disabled={index === 0}
								variant='outline'
								size='icon'>
								<ArrowUp />
							</Button>
							<Button
								onClick={() => playlist.handleReorder(index, 'down')}
								disabled={index === playlist.copy.tracks.items.length - 1}
								variant='outline'
								size='icon'>
								<ArrowDown />
							</Button>
						</div>
						<ContextMenu>
							<ContextMenuTrigger className='flex-1 hover:cursor-pointer'>
								<TrackDetails
									track={track}
									className={cn(
										'flex-1',
										trackIsOutOfOrder(index, track) && 'border-primary'
									)}
								/>
							</ContextMenuTrigger>
							<ContextMenuContent>
								<ContextMenuItem onClick={() => handleClick(track)}>
									Remove from playlist
									<ContextMenuShortcut>
										<Trash2 className='ml-4 size-4' />
									</ContextMenuShortcut>
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					</div>
				</li>
			))}
			<li className='flex gap-1'>
				<Badge variant='destructive'>
					Finish:{' '}
					{formattedDuration(
						playlist.duration.seconds,
						playlist.duration.minutes,
						playlist.duration.hours
					)}
				</Badge>
			</li>
		</ul>
	);
}
