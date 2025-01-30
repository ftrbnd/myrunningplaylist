import { auth } from '@/lib/auth';
import { getAccessToken, getPlaylist } from '@/services/spotify';
import { headers } from 'next/headers';

interface Props {
	params: Promise<{ playlistId: string }>;
}

export default async function Page({ params }: Props) {
	const playlistId = (await params).playlistId;

	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});
	const token = await getAccessToken({ userId: session?.user.id });
	const { playlist, error } = await getPlaylist({ token, id: playlistId });

	if (error) return <p>{error.message}</p>;

	return <div>My playlist: {playlist?.name}</div>;
}
