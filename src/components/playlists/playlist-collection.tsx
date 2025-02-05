import { auth } from '@/lib/auth';
import { getPlaylists } from '@/services/spotify';
import PlaylistCard from './playlist-card';
import { headers } from 'next/headers';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function PlaylistCollection() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const { playlists } = await getPlaylists({
		token: session?.account.accessToken,
		spotifyUserId: session?.account.accountId,
	});

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
			{playlists.map((playlist) => (
				<li
					key={playlist.id}
					className='h-full'>
					<PlaylistCard playlist={playlist} />
				</li>
			))}
		</ul>
	);
}
