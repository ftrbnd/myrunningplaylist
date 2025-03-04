import { Playlist, Track } from '@spotify/web-api-ts-sdk';
import { useCallback, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { PlaylistStoresContext } from '@/providers/playlist-stores-provider';
import { Duration } from '@/lib/duration';
import { Race } from '@/lib/race';

export type PlaylistState = {
	playlist: Playlist<Track>;
	race?: Race | null;
	goalTime?: Duration | null;
};

export type PlaylistActions = {
	reorderTrack: (index: number, direction: 'up' | 'down') => void;
	setPlaylist: (newPlaylist: Playlist<Track>) => void;
	setRace: (newRace?: Race | null) => void;
	setGoalTime: (newGoalTime?: Duration | null) => void;
};

export type PlaylistStore = PlaylistState & PlaylistActions;

export const createPlaylistStore = (initState: PlaylistState) => {
	return createStore<PlaylistStore>()((set) => ({
		...initState,
		reorderTrack: (index, direction) =>
			set((state) => {
				const [track] = state.playlist.tracks.items.splice(index, 1);
				state.playlist.tracks.items.splice(
					direction === 'up' ? index - 1 : index + 1,
					0,
					track
				);

				return {
					...state,
					playlist: {
						...state.playlist,
						tracks: {
							...state.playlist.tracks,
							items: [...state.playlist.tracks.items],
						},
					},
				};
			}),
		setPlaylist: (newPlaylist: Playlist<Track>) =>
			set((state) => {
				return {
					...state,
					playlist: newPlaylist,
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
	return (playlist: Playlist<Track>) => {
		if (!playlistStores.has(playlist.id)) {
			playlistStores.set(
				playlist.id,
				createPlaylistStore({
					playlist,
				})
			);
		}

		return playlistStores.get(playlist.id)!;
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
		(playlist: Playlist<Track>) => createPlaylistStoreFactory(stores)(playlist),
		[stores]
	);

	return useStore(getOrCreatePlaylistStore(playlist), selector);
};
