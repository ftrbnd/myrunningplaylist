'use client';

import { usePlaylist } from '@/hooks/use-playlist';
import { cn } from '@/lib/cn';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
	playlistId: string;
}

export function RaceMarkers({ playlistId, ...props }: Props) {
	const playlist = usePlaylist(playlistId);

	// TODO: mile markers:, show X amount of markers (13 for half-marathon, 10 for 10k)
	// TODO: how to handle playlists that are longer than the race?

	const percentage = playlist.goalTimeToRuntimeRatio * 100;

	return (
		<div
			style={{
				height: `${percentage}%`,
			}}
			className={cn(
				`w-2 rounded-sm self-start bg-gradient-to-b from-green-400 dark:from-green-600 via-yellow-400 dark:via-yellow-600 to-red-600 dark:to-red-800`,
				props.className
			)}></div>
	);
}
