'use client';

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
import { useEditPlaylist } from '@/hooks/use-edit-playlist';
import { getDuration, formattedDuration } from '@/lib/duration';

interface Props extends ComponentProps<'div'> {
	playlistId: string;
}

function getTimestamp(secondsPerUnit: number | null, position: number) {
	if (!secondsPerUnit) return null;

	const d = getDuration(secondsPerUnit * 1000 * position);
	return formattedDuration(d);
}

export function RaceMarkers({ playlistId, ...props }: Props) {
	const { store, goalTimeToRuntimeRatio, secondsPerUnit } =
		useEditPlaylist(playlistId);
	if (!store.race || !store.goalTime) return null;

	const heightPercentage = goalTimeToRuntimeRatio * 100;
	const distanceMarkers = allRaceIntervals.get(store.race.name);

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
					height: `${heightPercentage}%`,
				}}
				className={cn(
					'w-2 rounded-sm self-start justify-self-center md:justify-self-auto',
					'flex flex-col justify-evenly',
					'bg-gradient-to-b from-green-400 dark:from-green-600 via-yellow-400 dark:via-yellow-600 to-red-600 dark:to-red-800',
					props.className
				)}>
				{distanceMarkers?.slice(0, -1).map((distance, i) => (
					<Marker
						key={i}
						distance={distance}
						timestamp={getTimestamp(secondsPerUnit, i + 1)}
					/>
				))}
			</motion.div>
		</AnimatePresence>
	);
}

interface MarkerProps extends ComponentProps<'div'> {
	distance?: string;
	timestamp: string | null;
}

export function Marker({ distance, timestamp, ...props }: MarkerProps) {
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
				<TooltipContent className='flex flex-col items-center'>
					<p>{distance}</p>
					{timestamp && <p className='font-extrabold'>{timestamp}</p>}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
