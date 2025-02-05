import { auth } from '@/lib/auth';
import { getAccountDetails, getPlaylist } from '@/services/spotify';
import { headers } from 'next/headers';
import TrackDetails from '@/components/playlists/track-details';
import {
	durationDescription,
	formattedDuration,
	getDuration,
} from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Props {
	params: Promise<{ playlistId: string }>;
}

export default async function Page({ params }: Props) {
	const playlistId = (await params).playlistId;

	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});
	const { accessToken } = await getAccountDetails({ userId: session?.user.id });
	const { playlist, error } = await getPlaylist({
		token: accessToken,
		id: playlistId,
	});

	if (error) throw new Error(error.message);
	if (!playlist) throw new Error('Playlist was not found.');

	const runtimeMs = playlist.tracks.items.reduce(
		(prev, cur) => prev + cur.track.duration_ms,
		0
	);
	const { hours, minutes, seconds } = getDuration(runtimeMs);

	const getStartingTimestamp = (trackIndex: number) => {
		const tracksBefore = playlist.tracks.items.filter((_, i) => i < trackIndex);
		const currentMs = tracksBefore.reduce(
			(prev, cur) => prev + cur.track.duration_ms,
			0
		);

		const { hours, minutes, seconds } = getDuration(currentMs);
		return formattedDuration(seconds, minutes, hours);
	};

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
			<ul className='flex flex-col gap-2'>
				{playlist.tracks.items.map(({ track }, i) => (
					<li
						key={track.id}
						className='flex flex-col gap-1'>
						<div className='flex gap-1'>
							{i === 0 && <Badge variant='green'>Start</Badge>}
							<p className='font-medium underline'>{getStartingTimestamp(i)}</p>
						</div>
						<TrackDetails track={track} />
					</li>
				))}
				<li className='flex gap-1'>
					<Badge variant='destructive'>Finish</Badge>
					<p className='font-medium underline'>
						{formattedDuration(seconds, minutes, hours)}
					</p>
				</li>
			</ul>
		</div>
	);
}
