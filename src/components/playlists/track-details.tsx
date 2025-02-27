import { Track } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { Icons } from '@/components/layout/icons';
import { cn, formattedDuration, getDuration } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { ComponentProps } from 'react';
import { DragControls, motion } from 'motion/react';
import { Grip } from 'lucide-react';

interface Props extends ComponentProps<'div'> {
	track: Track;
	dragControls: DragControls;
}

export const MotionTrackDetails = motion.create(TrackDetails, {
	forwardMotionProps: true,
});

export function TrackDetails({ track, dragControls, ...props }: Props) {
	const { minutes, seconds } = getDuration(track.duration_ms);
	const image = track.album.images.reverse().find((img) => img !== undefined);
	const artists = track.artists.map((artist) => artist.name).join(', ');

	return (
		<div
			ref={props.ref}
			className={cn(
				'bg-card flex items-center gap-2 rounded-md border p-4 md:max-w-xl hover:bg-secondary/80',
				props.className
			)}>
			{image ? (
				<Image
					className='w-16 h-16 rounded-md'
					src={image.url}
					height={image.height}
					width={image.width}
					alt={track.name}
				/>
			) : (
				<Icons.localFile />
			)}
			<TooltipProvider>
				<div className='flex-1 space-y-1'>
					<Tooltip>
						<TooltipTrigger className='font-medium leading-none line-clamp-1 max-w-16 md:max-w-none'>
							{track.name}
						</TooltipTrigger>
						<TooltipContent>
							<p>{track.name}</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger className='text-sm text-muted-foreground line-clamp-1 max-w-16 md:max-w-none'>
							{artists}
						</TooltipTrigger>
						<TooltipContent>
							<p>{artists}</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<Tooltip>
					<TooltipTrigger className='text-muted-foreground line-clamp-1 max-w-8 md:max-w-none'>
						{track.album.name}
					</TooltipTrigger>
					<TooltipContent>
						<p>{track.album.name}</p>
					</TooltipContent>
				</Tooltip>
				<p className='font-medium'>{formattedDuration(seconds, minutes)}</p>
				<Grip
					className='self-center min-h-5 max-h-5 min-w-5 max-w-5 hover:cursor-grab hover:opacity-80'
					onPointerDown={(event) => dragControls.start(event)}
					style={{ touchAction: 'none' }}
				/>
			</TooltipProvider>
		</div>
	);
}
