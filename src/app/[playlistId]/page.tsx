import { auth } from '@/lib/auth';
import { getPlaylist } from '@/services/spotify';
import { headers } from 'next/headers';
import { durationDescription, getDuration } from '@/lib/utils';
import { RaceForm } from '@/components/playlists/race-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaylistTracks } from '@/components/playlists/playlist-tracks';

interface Props {
	params: Promise<{ playlistId: string }>;
}

export default async function Page({ params }: Props) {
	const playlistId = (await params).playlistId;

	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const { playlist } = await getPlaylist({
		token: session?.account.accessToken,
		id: playlistId,
	});

	if (!playlist) throw new Error('Playlist was not found.');

	const runtimeMs = playlist.tracks.items.reduce(
		(prev, cur) => prev + cur.track.duration_ms,
		0
	);
	const { hours, minutes, seconds } = getDuration(runtimeMs);

	return (
		<div>
			<div className='flex justify-between items-center'>
				<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4'>
					{playlist.name}
				</h1>

				<p className='text-muted-foreground'>
					Total runtime: {durationDescription(seconds, minutes, hours)}
				</p>
			</div>
			<div className='flex flex-col gap-2 md:grid md:grid-cols-2'>
				<Card className=' h-min w-full md:w-min md:col-start-2 md:row-start-1 md:justify-self-end'>
					<CardHeader>
						<CardTitle className='scroll-m-20 text-xl font-semibold tracking-tight'>
							Select your race
						</CardTitle>
					</CardHeader>
					<CardContent>
						<RaceForm />
					</CardContent>
				</Card>
				<PlaylistTracks playlist={playlist} />
			</div>
		</div>
	);
}
