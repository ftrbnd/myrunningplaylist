'use client';

import PlaylistCard from '@/components/playlists/playlist-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { usePlaylists } from '@/hooks/use-playlists';

export default function PlaylistCollection() {
	const { playlists } = usePlaylists();

	if (!playlists || playlists.length === 0)
		return (
			<Alert className='md:max-w-xl'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>No playlists were found.</AlertTitle>
				<AlertDescription>Try again later.</AlertDescription>
			</Alert>
		);

	return (
		<ul className='card-grid'>
			{playlists.map((playlist, i) => (
				<li
					key={`${playlist.id}-${i}`}
					className='h-full'>
					<PlaylistCard playlist={playlist} />
				</li>
			))}
		</ul>
	);
}
