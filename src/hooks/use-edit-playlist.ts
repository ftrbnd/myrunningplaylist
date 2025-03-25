import { usePlaylistStore } from '@/providers/playlist-stores';
import { usePlaylist } from '@/hooks/use-playlist';
import {
	Duration,
	durationToSeconds,
	formattedDuration,
	getDuration,
} from '@/lib/duration';
import { Race, allRaces } from '@/lib/race';

function getPace(race?: Race | null, goalTime?: Duration | null) {
	if (!race || !goalTime) return null;

	const distanceValue = allRaces.get(race.name);
	if (!distanceValue) return null;

	const seconds = durationToSeconds(goalTime);

	if (distanceValue >= 400) {
		// metric unit race: minutes per km
		const kilometers = Math.floor(distanceValue / 1000);
		const secondsPerKm = Math.floor(seconds / kilometers);
		const d = getDuration(secondsPerKm * 1000);
		const fmt = formattedDuration(d);

		return `${fmt}/km`;
	} else {
		// imperial unit race: minutes per mile
		const secondsPerMile = Math.floor(seconds / distanceValue);
		const d = getDuration(secondsPerMile * 1000);
		const fmt = formattedDuration(d);

		return `${fmt}/mi`;
	}
}

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

	const pace = getPace(store.race, store.goalTime);

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
		pace,
	};
}
