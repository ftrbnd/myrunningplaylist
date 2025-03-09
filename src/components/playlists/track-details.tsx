import { Track } from '@spotify/web-api-ts-sdk';
import { cn } from '@/lib/cn';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { ComponentProps } from 'react';
import { DragControls, motion } from 'motion/react';
import { Grip } from 'lucide-react';
import { formattedDuration, getDuration } from '@/lib/duration';
import { ImageThumbnail } from './image-thumbnail';

interface Props extends ComponentProps<'div'> {
	track: Track;
	dragControls: DragControls;
}

export const MotionTrackDetails = motion.create(TrackDetails, {
	forwardMotionProps: true,
});

export function TrackDetails({ track, dragControls, ...props }: Props) {
	const { minutes, seconds } = getDuration(track.duration_ms);
	const artists = track.artists.map((artist) => artist.name).join(', ');

	return (
		<div
			ref={props.ref}
			className={cn(
				'bg-card flex items-center gap-2 rounded-md border p-4 md:max-w-xl hover:bg-secondary/80 shadow-md shadow-muted',
				props.className
			)}>
			<ImageThumbnail
				images={track.album.images}
				className='w-16 h-16 rounded-md'
				alt={track.name}
			/>
			<TooltipProvider>
				<div className='flex-1 space-y-1'>
					<Tooltip>
						<TooltipTrigger className='text-start font-medium leading-none line-clamp-1 md:max-w-none'>
							{track.name}
						</TooltipTrigger>
						<TooltipContent>
							<p>{track.name}</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger className='text-start text-sm text-muted-foreground line-clamp-1 md:max-w-none'>
							{artists}
						</TooltipTrigger>
						<TooltipContent>
							<p>{artists}</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<Tooltip>
					<TooltipTrigger className='text-muted-foreground line-clamp-1 md:max-w-none'>
						{track.album.name}
					</TooltipTrigger>
					<TooltipContent>
						<p>{track.album.name}</p>
					</TooltipContent>
				</Tooltip>
				<p className='font-medium'>{formattedDuration({ seconds, minutes })}</p>
				<Grip
					className='self-center min-h-5 max-h-5 min-w-5 max-w-5 hover:cursor-grab hover:opacity-80'
					onPointerDown={(event) => dragControls.start(event)}
					style={{ touchAction: 'none' }}
				/>
			</TooltipProvider>
		</div>
	);
}
