import { Playlist, Track } from '@spotify/web-api-ts-sdk';
import { useCallback, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { PlaylistStoresContext } from '@/providers/playlist-stores-provider';
import { Duration } from '@/lib/duration';
import { Race } from '@/lib/race';

export type PlaylistState = {
	tracks: Track[];
	race?: Race | null;
	goalTime?: Duration | null;
};

export type PlaylistActions = {
	reorderTrack: (index: number, direction: 'up' | 'down') => void;
	setTracks: (newTracks: Track[]) => void;
	setRace: (newRace?: Race | null) => void;
	setGoalTime: (newGoalTime?: Duration | null) => void;
};

export type PlaylistStore = PlaylistState & PlaylistActions;

export const createPlaylistStore = (initState: PlaylistState) => {
	return createStore<PlaylistStore>()((set) => ({
		...initState,
		reorderTrack: (index, direction) =>
			set((state) => {
				const [track] = state.tracks.splice(index, 1);
				state.tracks.splice(
					direction === 'up' ? index - 1 : index + 1,
					0,
					track
				);

				return {
					...state,
					tracks: [...state.tracks],
				};
			}),
		setTracks: (newTracks: Track[]) =>
			set((state) => {
				return {
					...state,
					tracks: newTracks,
				};
			}),
		setRace: (newRace?: Race | null) =>
			set((state) => {
				return {
					...state,
					race: newRace,
				};
			}),
		setGoalTime: (newGoalTime?: Duration | null) =>
			set((state) => {
				return {
					...state,
					goalTime: newGoalTime,
				};
			}),
	}));
};

export type PlaylistStoreApi = ReturnType<typeof createPlaylistStore>;
export type PlaylistStores = Map<string, PlaylistStoreApi>;

export const createPlaylistStoreFactory = (playlistStores: PlaylistStores) => {
	return (playlistId: string, tracks: Track[]) => {
		if (!playlistStores.has(playlistId)) {
			playlistStores.set(
				playlistId,
				createPlaylistStore({
					tracks,
				})
			);
		}

		return playlistStores.get(playlistId)!;
	};
};

export const usePlaylistStore = <U>(
	playlist: Playlist<Track>,
	selector: (state: PlaylistStore) => U
) => {
	const stores = useContext(PlaylistStoresContext);

	if (!stores) {
		throw new Error(
			'usePlaylistStore must be used within PlaylistStoresProvider'
		);
	}

	const getOrCreatePlaylistStore = useCallback(
		(playlist: Playlist<Track>) =>
			createPlaylistStoreFactory(stores)(
				playlist.id,
				playlist.tracks.items.map((t) => t.track)
			),
		[stores]
	);

	return useStore(getOrCreatePlaylistStore(playlist), selector);
};
