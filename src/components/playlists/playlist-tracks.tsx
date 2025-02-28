'use client';

import { cn, formattedDuration, getDuration } from '@/lib/utils';
import { PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MotionTrackDetails } from '@/components/playlists/track-details';
import { usePlaylist } from '@/hooks/use-playlist';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuShortcut,
	ContextMenuTrigger,
	ContextMenuItem,
} from '@/components/ui/context-menu';
import {
	AnimatePresence,
	Reorder,
	useDragControls,
	useMotionValue,
} from 'motion/react';
import { useRaisedShadow } from '@/hooks/use-raised-shadow';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'ul'> {
	playlistId: string;
}

export function PlaylistTracks({ playlistId, ...props }: Props) {
	const playlist = usePlaylist(playlistId);

	const handleReorder = (newOrder: PlaylistedTrack<Track>[]) => {
		playlist.setCopy({
			...playlist.copy,
			tracks: {
				...playlist.copy.tracks,
				items: newOrder,
			},
		});
	};

	return (
		<AnimatePresence>
			<Reorder.Group
				values={playlist.copy.tracks.items}
				onReorder={handleReorder}
				className={cn(
					'flex flex-col gap-2 md:col-start-1 md:row-start-1',
					props.className
				)}>
				{playlist.copy.tracks.items.map((item, index) => (
					<ReorderableTrackItem
						key={`${item.track.id}-${index}`}
						value={item}
						index={index}
						playlistId={playlistId}
					/>
				))}
				<li className='flex gap-1'>
					<Badge variant='destructive'>
						Finish: {formattedDuration(playlist.duration)}
					</Badge>
				</li>
			</Reorder.Group>
		</AnimatePresence>
	);
}

interface TrackItemProps {
	value: PlaylistedTrack<Track>;
	index: number;
	playlistId: string;
}

function ReorderableTrackItem({ value, index, playlistId }: TrackItemProps) {
	const playlist = usePlaylist(playlistId);

	const y = useMotionValue(0);
	const boxShadow = useRaisedShadow(y);
	const controls = useDragControls();

	const getStartingTimestamp = (trackIndex: number) => {
		const tracksBefore = playlist.copy.tracks.items.filter(
			(_, i) => i < trackIndex
		);
		const currentMs = tracksBefore.reduce(
			(prev, cur) => prev + cur.track.duration_ms,
			0
		);

		const duration = getDuration(currentMs);
		return formattedDuration(duration);
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
		<Reorder.Item
			value={value}
			style={{ boxShadow, y }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			dragListener={false}
			dragControls={controls}
			className='flex flex-col gap-1 rounded-md p-2'>
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
						<MotionTrackDetails
							track={value.track}
							dragControls={controls}
							className={cn(
								'flex-1',
								trackIsOutOfOrder(index, value.track) && 'border-primary'
							)}
						/>
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem onClick={() => handleClick(value.track)}>
							Remove from playlist
							<ContextMenuShortcut>
								<Trash2 className='ml-4 size-4' />
							</ContextMenuShortcut>
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			</div>
		</Reorder.Item>
	);
}
