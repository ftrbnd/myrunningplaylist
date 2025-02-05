'use client';

import { Playlist, TrackItem } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Icons } from '../layout/icons';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
	playlist: Playlist<TrackItem>;
}

export default function PlaylistCard({ playlist }: Props) {
	const [hover, setHover] = useState(false);
	const router = useRouter();

	const image = playlist.images
		? playlist.images.find((image) => image !== undefined)
		: null;

	return (
		<div
			onMouseOver={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className={cn('playlist-card', hover && 'cursor-pointer bg-muted')}
			onClick={() => router.push(`/${playlist.id}`)}>
			{image ? (
				<Image
					className={cn(
						'w-16 h-16 md:h-32 md:w-32 rounded-md',
						hover && 'opacity-50'
					)}
					src={image.url}
					height={image.height ?? 64}
					width={image.width ?? 64}
					alt={playlist.name}
				/>
			) : (
				<Icons.localFile className='md:h-32 md:w-32' />
			)}
			<div className='flex-1 space-y-1'>
				<p className={cn('font-semibold leading-none', hover && 'underline')}>
					{playlist.name}
				</p>
				<p className='text-sm text-muted-foreground'>
					{playlist.tracks.total} tracks
				</p>
			</div>
		</div>
	);
}
