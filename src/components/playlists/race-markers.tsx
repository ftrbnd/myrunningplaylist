'use client';

import { usePlaylist } from '@/hooks/use-playlist';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
	playlistId: string;
}

export function RaceMarkers({ playlistId, ...props }: Props) {
	const playlist = usePlaylist(playlistId);
	console.log(playlist.race, playlist.goalTime);

	// TODO: mile markers:, show X amount of markers (13 for half-marathon, 10 for 10k)

	// TODO: how to handle playlists that are loner than the race?

	return (
		<div
			className={cn(
				'h-full w-2 rounded-sm bg-gradient-to-b from-green-400 dark:from-green-600 via-yellow-400 dark:via-yellow-600 to-red-600 dark:to-red-800',
				props.className
			)}></div>
	);
}
