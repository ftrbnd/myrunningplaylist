'use client';

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import { Playlist, TrackItem } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Props {
	playlist: Playlist<TrackItem>;
}

export default function PlaylistCard({ playlist }: Props) {
	const router = useRouter();

	const image = playlist.images
		? playlist.images.find((image) => image !== undefined && image !== null)
		: null;

	return (
		<Card
			onClick={() => router.push(`/${playlist.id}`)}
			className='h-full hover:bg-transparent hover:cursor-pointer'>
			<CardHeader>
				<CardTitle className='hover:underline'>{playlist.name}</CardTitle>
				<CardDescription>{playlist.tracks.total} tracks</CardDescription>
			</CardHeader>
			<CardContent>
				<Image
					className='h-full w-full aspect-square object-cover rounded-md'
					src={image?.url ?? './placeholder.svg'}
					alt={playlist.name}
					width={image?.width ?? 100}
					height={image?.height ?? 100}
					priority
				/>
			</CardContent>
		</Card>
	);
}
