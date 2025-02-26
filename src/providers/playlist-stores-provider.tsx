'use client';

import { type ReactNode, createContext, useState } from 'react';
import { PlaylistStoreApi, PlaylistStores } from '@/providers/playlist-stores';

interface PlaylistStoresProviderProps {
	children: ReactNode;
}

export const PlaylistStoresContext = createContext<PlaylistStores | null>(null);

export const PlaylistStoresProvider = ({
	children,
}: PlaylistStoresProviderProps) => {
	const [stores] = useState<PlaylistStores>(
		() => new Map<string, PlaylistStoreApi>()
	);

	return (
		<PlaylistStoresContext.Provider value={stores}>
			{children}
		</PlaylistStoresContext.Provider>
	);
};
