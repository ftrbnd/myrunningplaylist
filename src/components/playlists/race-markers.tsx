import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
	playlistId: string;
}

export function RaceMarkers({ playlistId, ...props }: Props) {
	return (
		<div
			className={cn(
				'h-full w-2 rounded-sm bg-gradient-to-b from-green-400 dark:from-green-600 via-yellow-400 dark:via-yellow-600 to-red-600 dark:to-red-800',
				props.className
			)}></div>
	);
}
