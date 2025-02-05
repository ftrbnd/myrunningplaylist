import { Track } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { Icons } from '@/components/layout/icons';
import { formattedDuration, getDuration } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
	track: Track;
}

export default function TrackDetails({ track }: Props) {
	const { minutes, seconds } = getDuration(track.duration_ms);
	const image = track.album.images.reverse().find((img) => img !== undefined);
	const artists = track.artists.map((artist) => artist.name).join(', ');

	return (
		<div className='flex items-center space-x-4 rounded-md border p-4 md:max-w-xl'>
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
						<TooltipTrigger className='font-medium leading-none line-clamp-1'>
							{track.name}
						</TooltipTrigger>
						<TooltipContent>
							<p>{track.name}</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger className='text-sm text-muted-foreground line-clamp-1'>
							{artists}
						</TooltipTrigger>
						<TooltipContent>
							<p>{artists}</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<Tooltip>
					<TooltipTrigger className='text-muted-foreground line-clamp-1'>
						{track.album.name}
					</TooltipTrigger>
					<TooltipContent>
						<p>{track.album.name}</p>
					</TooltipContent>
				</Tooltip>
				<p className='font-medium'>{formattedDuration(seconds, minutes)}</p>
			</TooltipProvider>
		</div>
	);
}
