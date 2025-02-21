'use client';

import { authClient } from '@/lib/auth-client';
import { durationDescription, getDuration } from '@/lib/utils';
import { getPlaylist } from '@/services/spotify';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlaylistTracks } from '@/components/playlists/playlist-tracks';
import { RaceForm } from '@/components/playlists/race-form';

const { useSession } = authClient;

export function PlaylistDetails({ id }: { id: string }) {
	const { data: session } = useSession();
	const {
		data: { playlist },
	} = useSuspenseQuery({
		queryKey: ['playlists', id],
		queryFn: () =>
			getPlaylist({
				token: session?.account.accessToken,
				id,
			}),
	});

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
