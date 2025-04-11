import { PLAYLISTS_QUERY_KEY } from '@/providers/get-query-client';
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
import { useSession } from '@/hooks/use-session';
import { Track } from '@spotify/web-api-ts-sdk';

interface MutationParams {
	newOrder: Track[];
	resetEditedTracks: () => void;
}

export function usePlaylist(playlistId: string) {
	const session = useSession();
	const queryClient = useQueryClient();

	const {
		data: { playlist },
		refetch,
	} = useSuspenseQuery({
		queryKey: [PLAYLISTS_QUERY_KEY, playlistId],
		queryFn: () =>
			getPlaylist({
				token: session.user?.accessToken,
				id: playlistId,
			}),
	});

	const reorderMutation = useMutation({
		mutationFn: async (params: MutationParams) => {
			const promises = params.newOrder
				.map((track, newIndex) => {
					const original = playlist.tracks.items;
					if (original.at(newIndex)?.track.uri === track.uri) return;

					const originalIndex = original.findIndex(
						({ track: t }) => t.uri === track.uri
					);

					return reorderPlaylist({
						token: session.user?.accessToken,
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
		onSuccess: async (_data, vars) => {
			await queryClient.invalidateQueries({
				queryKey: [PLAYLISTS_QUERY_KEY, playlistId],
			});

			vars.resetEditedTracks();
		},
	});

	const removeTrackMutation = useMutation({
		mutationFn: async ({ trackUris }: { trackUris: string[] }) =>
			await removeTracksFromPlaylist({
				token: session.user?.accessToken,
				playlistId: playlist.id,
				trackUris,
			}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [PLAYLISTS_QUERY_KEY, playlistId],
			});
		},
	});

	return {
		playlist,
		refetch,
		submitReorder: reorderMutation.mutateAsync,
		reorderIsPending: reorderMutation.isPending,
		reorderIsSuccess: reorderMutation.isSuccess,
		removeTracks: removeTrackMutation.mutateAsync,
		removalIsPending: removeTrackMutation.isPending,
	};
}
