import { auth } from '@/lib/auth';
import { getAccountDetails, getPlaylists } from '@/services/spotify';
import PlaylistCard from './playlist-card';
import { headers } from 'next/headers';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function PlaylistCollection() {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});
	const { accessToken, accountId } = await getAccountDetails({
		userId: session?.user.id,
	});
	const { playlists, error } = await getPlaylists({
		token: accessToken,
		spotifyUserId: accountId,
	});

	if (error) throw new Error(error.message);

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
