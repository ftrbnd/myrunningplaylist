'use client';

import { usePlaylist } from '@/hooks/use-playlist';
import { cn } from '@/lib/cn';
import { allRaceIntervals } from '@/lib/race';
import { ComponentProps } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'motion/react';

interface Props extends ComponentProps<'div'> {
	playlistId: string;
}

export function RaceMarkers({ playlistId, ...props }: Props) {
	const playlist = usePlaylist(playlistId);
	if (!playlist.race) return null;

	// TODO: add timestamp at each interval

	const percentage = playlist.goalTimeToRuntimeRatio * 100;
	const intervals = allRaceIntervals.get(playlist.race.name);

	return (
		<AnimatePresence>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				exit={{ scale: 0 }}
				transition={{
					delay: 0.1,
				}}
				style={{
					height: `${percentage}%`,
				}}
				className={cn(
					'w-2 rounded-sm self-start justify-self-center md:justify-self-auto',
					'flex flex-col justify-evenly',
					'bg-gradient-to-b from-green-400 dark:from-green-600 via-yellow-400 dark:via-yellow-600 to-red-600 dark:to-red-800',
					props.className
				)}>
				{intervals?.slice(0, -1).map((interval, i) => (
					<Marker
						key={i}
						label={interval}
					/>
				))}
			</motion.div>
		</AnimatePresence>
	);
}

interface MarkerProps extends ComponentProps<'div'> {
	label?: string;
}

export function Marker({ label, ...props }: MarkerProps) {
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger className='self-center'>
					<div
						{...props}
						className={cn(
							'w-4 h-4 self-center rounded-lg z-10 border-2 bg-slate-200 border-slate-800 dark:bg-slate-800 dark:border-slate-200 hover:cursor-pointer',
							props.className
						)}></div>
				</TooltipTrigger>
				<TooltipContent>
					<p>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
