import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { Playlist, TrackItem } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';

interface Props {
	playlist: Playlist<TrackItem>;
}

export default function PlaylistCard({ playlist }: Props) {
	const image = playlist.images
		? playlist.images.find((image) => image !== undefined && image !== null)
		: null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{playlist.name}</CardTitle>
				<CardDescription>{playlist.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<Image
					src={image?.url ?? './placeholder.svg'}
					alt={playlist.name}
					width={image?.width ?? 100}
					height={image?.height ?? 100}
					priority
				/>
			</CardContent>
			<CardFooter>
				<p>{playlist.tracks.total} tracks</p>
			</CardFooter>
		</Card>
	);
}
