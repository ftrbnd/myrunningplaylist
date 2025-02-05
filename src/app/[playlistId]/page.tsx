import { auth } from '@/lib/auth';
import { getAccountDetails, getPlaylist } from '@/services/spotify';
import { headers } from 'next/headers';
import TrackDetails from '@/components/playlists/track-details';

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

	return (
		<div>
			<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4'>
				{playlist?.name}
			</h1>
			<ul className='flex flex-col gap-2'>
				{playlist.tracks.items.map(({ track }) => (
					<li key={track.id}>
						<TrackDetails track={track} />
					</li>
				))}
			</ul>
		</div>
	);
}
