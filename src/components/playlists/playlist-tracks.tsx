'use client';

import { cn } from '@/lib/cn';
import { Track } from '@spotify/web-api-ts-sdk';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrackDetails } from '@/components/playlists/track-details';
import { usePlaylist } from '@/hooks/use-playlist';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuShortcut,
	ContextMenuTrigger,
	ContextMenuItem,
} from '@/components/ui/context-menu';
import { AnimatePresence, Reorder, useMotionValue } from 'motion/react';
import { useRaisedShadow } from '@/hooks/use-raised-shadow';
import { ComponentProps } from 'react';
import { formattedDuration, getDuration } from '@/lib/duration';
import { useEditPlaylist } from '@/hooks/use-edit-playlist';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props extends ComponentProps<'ul'> {
	playlistId: string;
	showOverflowWarning: boolean;
}

export function PlaylistTracks({
	playlistId,
	showOverflowWarning,
	...props
}: Props) {
	const { store, duration } = useEditPlaylist(playlistId);

	return (
		<Reorder.Group
			values={store.tracks}
			onReorder={store.setTracks}
			className={cn(
				'flex flex-col gap-2 md:col-start-1 md:row-start-1',
				props.className
			)}>
			<AnimatePresence>
				{store.tracks.map((item, index) => (
					<ReorderableTrackItem
						key={item.id ?? item.uri}
						value={item}
						index={index}
						playlistId={playlistId}
					/>
				))}
			</AnimatePresence>
			<li className='flex gap-1'>
				<Badge variant='destructive'>
					Finish: {formattedDuration(duration)}
				</Badge>
			</li>
			{showOverflowWarning && (
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Your playlist is too short!</AlertTitle>
					<AlertDescription>
						Add more tracks to increase the runtime.
					</AlertDescription>
				</Alert>
			)}
		</Reorder.Group>
	);
}

interface TrackItemProps {
	value: Track;
	index: number;
	playlistId: string;
}

function ReorderableTrackItem({ value, index, playlistId }: TrackItemProps) {
	const { playlist, removeTracks } = usePlaylist(playlistId);
	const { store } = useEditPlaylist(playlistId);

	const y = useMotionValue(0);
	const boxShadow = useRaisedShadow(y);

	const getStartingTimestamp = (trackIndex: number) => {
		const tracksBefore = store.tracks.filter((_, i) => i < trackIndex);
		const currentMs = tracksBefore.reduce(
			(prev, cur) => prev + cur.duration_ms,
			0
		);

		const duration = getDuration(currentMs);
		return formattedDuration(duration);
	};

	const trackIsOutOfOrder = (index: number, track: Track) => {
		const original = playlist.tracks.items.at(index)?.track;
		if (!original) return false;

		return original.uri !== track.uri;
	};

	const handleClick = async (track: Track) => {
		await removeTracks({ trackUris: [track.uri] });
	};

	return (
		<Reorder.Item
			value={value}
			style={{ boxShadow, y }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			whileHover={{ scale: 0.95 }}
			onHoverEnd={() => {}}
			whileDrag={{ scale: 1.05 }}
			className='flex flex-col gap-1 rounded-md p-2 hover:cursor-grab hover:opacity-80'>
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
						onClick={() => store.reorderTrack(index, 'up')}
						disabled={index === 0}
						variant='outline'
						size='icon'>
						<ArrowUp />
					</Button>
					<Button
						onClick={() => store.reorderTrack(index, 'down')}
						disabled={index === store.tracks.length - 1}
						variant='outline'
						size='icon'>
						<ArrowDown />
					</Button>
				</div>
				<ContextMenu>
					<ContextMenuTrigger className='flex-1'>
						<TrackDetails
							track={value}
							className={cn(
								'flex-1',
								trackIsOutOfOrder(index, value) && 'border-primary'
							)}
						/>
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem onClick={() => handleClick(value)}>
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
