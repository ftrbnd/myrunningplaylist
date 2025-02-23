import { authClient } from '@/lib/auth-client';
import { PLAYLISTS_QUERY_KEY } from '@/lib/get-query-client';
import { getDuration } from '@/lib/utils';
import { getPlaylist, reorderPlaylist } from '@/services/spotify';
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { useState } from 'react';

const { useSession } = authClient;

export function usePlaylist(playlistId: string) {
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	const {
		data: { playlist },
	} = useSuspenseQuery({
		queryKey: [PLAYLISTS_QUERY_KEY, playlistId],
		queryFn: () =>
			getPlaylist({
				token: session?.account.accessToken,
				id: playlistId,
			}),
	});
	const [copy, setCopy] = useState(playlist);

	const copyIsReordered = copy.tracks.items.some(
		({ track }, i) => playlist.tracks.items.at(i)?.track.id !== track.id
	);

	const runtimeMs = playlist.tracks.items.reduce(
		(prev, cur) => prev + cur.track.duration_ms,
		0
	);
	const duration = getDuration(runtimeMs);

	const handleReorder = (index: number, direction: 'up' | 'down') => {
		setCopy((prev) => {
			const [track] = prev.tracks.items.splice(index, 1);
			prev.tracks.items.splice(
				direction === 'up' ? index - 1 : index + 1,
				0,
				track
			);

			return {
				...prev,
				tracks: {
					...prev.tracks,
					items: [...prev.tracks.items],
				},
			};
		});
	};

	const mutation = useMutation({
		mutationFn: async () => {
			const promises = copy.tracks.items
				.map(({ track }, newIndex) => {
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
		onError: () => {
			// An error happened!
		},
		onSuccess: () => {
			// Boom baby!
			queryClient.invalidateQueries({
				queryKey: [PLAYLISTS_QUERY_KEY, playlist.id],
			});
		},
		// onSettled: (data, error, variables, context) => {
		// 	// Error or success... doesn't matter!
		// },
	});

	return {
		original: playlist,
		duration,
		copy,
		copyIsReordered,
		resetCopy: () => setCopy(playlist),
		handleReorder,
		submitReorder: mutation,
	};
}
