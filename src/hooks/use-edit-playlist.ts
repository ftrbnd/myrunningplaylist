import { usePlaylistStore } from '@/providers/playlist-stores';
import { usePlaylist } from '@/hooks/use-playlist';
import { durationToSeconds, getDuration } from '@/lib/duration';

export function useEditPlaylist(playlistId: string) {
	const { playlist, refetch } = usePlaylist(playlistId);
	const store = usePlaylistStore(playlist, (state) => state);

	const resetTracks = async () => {
		const { data } = await refetch();
		if (data?.playlist)
			store.setTracks(data?.playlist.tracks.items.map(({ track }) => track));
	};

	const tracksAreReordered = store.tracks.some(
		(track, i) => playlist.tracks.items.at(i)?.track.id !== track.id
	);

	const runtimeMs = playlist.tracks.items.reduce(
		(prev, cur) => prev + cur.track.duration_ms,
		0
	);
	const duration = getDuration(runtimeMs);

	const runtimeSeconds = runtimeMs / 1000;
	const goalTimeSeconds = durationToSeconds(store.goalTime);
	const goalTimeToRuntimeRatio = goalTimeSeconds / runtimeSeconds;

	return {
		store,
		resetTracks,
		// derived state
		duration,
		runtimeMs,
		runtimeSeconds,
		goalTimeSeconds,
		goalTimeToRuntimeRatio,
		tracksAreReordered,
	};
}
