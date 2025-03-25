import { usePlaylistStore } from '@/providers/playlist-stores';
import { usePlaylist } from '@/hooks/use-playlist';
import {
	Duration,
	durationToSeconds,
	formattedDuration,
	getDuration,
} from '@/lib/duration';
import { ImperialRaceValue, MetricRaceValue, Race, allRaces } from '@/lib/race';

function getDistanceValue(race?: Race | null, goalTime?: Duration | null) {
	if (!race || !goalTime) return null;

	const distanceValue = allRaces.get(race.name);
	return distanceValue;
}

function getSecondsPerBaseUnit(
	goalTime?: Duration | null,
	distanceValue?: MetricRaceValue | ImperialRaceValue | null
) {
	if (!goalTime || !distanceValue) return null;

	const seconds = durationToSeconds(goalTime);

	if (distanceValue >= 400) {
		const kilometers = Math.floor(distanceValue / 1000);
		const secondsPerKm = Math.floor(seconds / kilometers);
		return secondsPerKm;
	} else {
		const secondsPerMile = Math.floor(seconds / distanceValue);
		return secondsPerMile;
	}
}

function getPace(race?: Race | null, goalTime?: Duration | null) {
	const distanceValue = getDistanceValue(race, goalTime);
	if (!distanceValue)
		return {
			pace: null,
			secondsPerUnit: null,
		};

	const secondsPerUnit = getSecondsPerBaseUnit(goalTime, distanceValue);
	if (!secondsPerUnit)
		return {
			pace: null,
			secondsPerUnit: null,
		};

	const unit = distanceValue >= 400 ? 'km' : 'mi';
	const d = getDuration(secondsPerUnit * 1000);
	const fmt = formattedDuration(d);

	return {
		pace: `${fmt}/${unit}`,
		secondsPerUnit,
	};
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

	const { pace, secondsPerUnit } = getPace(store.race, store.goalTime);

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
		secondsPerUnit,
	};
}
