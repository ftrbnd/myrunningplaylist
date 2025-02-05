import { Track } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { Icons } from '../layout/icons';
import { formattedDuration, getDuration } from '@/lib/utils';

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
			<div className='flex-1 space-y-1'>
				<p className='font-medium leading-none'>{track.name}</p>
				<p className='text-sm text-muted-foreground'>{artists}</p>
			</div>
			<p className='text-muted-foreground'>{track.album.name}</p>
			<p className='font-medium'>{formattedDuration(seconds, minutes)}</p>
		</div>
	);
}
