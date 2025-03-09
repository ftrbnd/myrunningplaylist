import { authClient } from '@/lib/auth-client';
import { PLAYLISTS_QUERY_KEY } from '@/providers/get-query-client';
import { durationToSeconds, getDuration } from '@/lib/duration';
import { usePlaylistStore } from '@/providers/playlist-stores';
import {
	getPlaylist,
	removeTracksFromPlaylist,
	reorderPlaylist,
} from '@/services/spotify';
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';

const { useSession } = authClient;

export function usePlaylist(playlistId: string) {
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	const {
		data: { playlist },
		refetch,
	} = useSuspenseQuery({
		queryKey: [PLAYLISTS_QUERY_KEY, playlistId],
		queryFn: () =>
			getPlaylist({
				token: session?.account.accessToken,
				id: playlistId,
			}),
	});

	const {
		tracks,
		reorderTrack,
		setTracks,
		race,
		setRace,
		goalTime,
		setGoalTime,
	} = usePlaylistStore(JSON.parse(JSON.stringify(playlist)), (state) => state);

	const resetTracks = async () => {
		const { data } = await refetch();
		if (data?.playlist)
			setTracks(data?.playlist.tracks.items.map((t) => t.track));
	};

	const tracksAreReordered = tracks.some(
		(track, i) => playlist.tracks.items.at(i)?.track.id !== track.id
	);

	const runtimeMs = playlist.tracks.items.reduce(
		(prev, cur) => prev + cur.track.duration_ms,
		0
	);
	const duration = getDuration(runtimeMs);

	const runtimeSeconds = runtimeMs / 1000;
	const goalTimeSeconds = durationToSeconds(goalTime);
	const goalTimeToRuntimeRatio = goalTimeSeconds / runtimeSeconds;

	const reorderMutation = useMutation({
		mutationFn: async () => {
			const promises = tracks
				.map((track, newIndex) => {
					const original = playlist.tracks.items;
					if (original.at(newIndex)?.track.uri === track.uri) return;

					const originalIndex = original.findIndex(
						({ track: t }) => t.uri === track.uri
					);

					return reorderPlaylist({
						token: session?.account.accessToken,
						playlist,
						rangeStart: originalIndex,
						insertBefore: newIndex + 1,
						rangeLength: 1,
					});
				})
				.filter((p) => p !== undefined);

			const snapshot_ids = await Promise.all(promises);
			return snapshot_ids;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PLAYLISTS_QUERY_KEY, playlist.id],
			});
		},
	});

	const removeTrackMutation = useMutation({
		mutationFn: ({ trackUris }: { trackUris: string[] }) =>
			removeTracksFromPlaylist({
				token: session?.account.accessToken,
				playlistId: playlist.id,
				trackUris,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PLAYLISTS_QUERY_KEY, playlist.id],
			});
		},
	});

	return {
		// tanstack-query
		original: playlist,
		submitReorder: reorderMutation.mutate,
		removeTracks: removeTrackMutation.mutate,
		// zustand
		tracks,
		setTracks,
		resetTracks,
		handleReorder: reorderTrack,
		race,
		setRace,
		goalTime,
		setGoalTime,
		// derived state
		duration,
		runtimeMs,
		runtimeSeconds,
		goalTimeSeconds,
		goalTimeToRuntimeRatio,
		tracksAreReordered,
	};
}
