import { PLAYLISTS_QUERY_KEY } from '@/providers/get-query-client';
import { getPlaylists } from '@/services/spotify';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSession } from '@/hooks/use-session';
import { useDeferredValue, useState, useTransition } from 'react';

export function usePlaylists() {
	const session = useSession();

	const [isPending, startTransition] = useTransition();
	const [previousUrl, setPreviousUrl] = useState<string | null>(null);
	const [nextUrl, setNextUrl] = useState<string | null>(null);

	const [searchQuery, setSearchQuery] = useState('');
	const deferredQuery = useDeferredValue(searchQuery);

	const { data } = useSuspenseQuery({
		queryKey: [PLAYLISTS_QUERY_KEY, previousUrl, nextUrl, deferredQuery],
		queryFn: () =>
			getPlaylists({
				token: session.user?.accessToken,
				spotifyUserId: session.user?.spotifyId,
				previousUrl,
				nextUrl,
				searchQuery: deferredQuery,
			}),
	});

	return {
		playlists: data.playlists,
		isPending,
		getFirstUrl: () =>
			startTransition(() => {
				setPreviousUrl(null);
				setNextUrl(null);
			}),
		getPreviousUrl: () =>
			startTransition(() => {
				setPreviousUrl(data.previousUrl);
				setNextUrl(null);
			}),
		getNextUrl: () =>
			startTransition(() => {
				setPreviousUrl(null);
				setNextUrl(data.nextUrl);
			}),
		searchQuery,
		setSearchQuery,
	};
}
