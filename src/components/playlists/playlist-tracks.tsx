'use client';

import { cn, formattedDuration, getDuration } from '@/lib/utils';
import { Playlist, Track } from '@spotify/web-api-ts-sdk';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrackDetails from '@/components/playlists/track-details';
import { reorderPlaylist } from '@/services/spotify';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/components/playlists/toast';
import { useEffect, useState } from 'react';

const { useSession } = authClient;

export function PlaylistTracks({ playlist }: { playlist: Playlist<Track> }) {
	const { data } = useSession();

	const [playlistCopy, setPlaylistCopy] = useState(playlist);
	const isReordered = playlistCopy.tracks.items.some(
		({ track }, i) => playlist.tracks.items.at(i)?.track.id !== track.id
	);
	// TODO: add a state to keep track of reordered tracks

	useEffect(() => {
		toast({
			isReordered,
			reset: () => setPlaylistCopy(playlist),
			save: () => console.log('idk'),
		});
	}, [isReordered, playlist]);

	const getStartingTimestamp = (trackIndex: number) => {
		const tracksBefore = playlist.tracks.items.filter((_, i) => i < trackIndex);
		const currentMs = tracksBefore.reduce(
			(prev, cur) => prev + cur.track.duration_ms,
			0
		);

		const { hours, minutes, seconds } = getDuration(currentMs);
		return formattedDuration(seconds, minutes, hours);
	};

	const runtimeMs = playlist.tracks.items.reduce(
		(prev, cur) => prev + cur.track.duration_ms,
		0
	);
	const { hours, minutes, seconds } = getDuration(runtimeMs);

	const handleReorder = (index: number, direction: 'up' | 'down') => {
		setPlaylistCopy((prev) => {
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

	const submitReorder = async (index: number, direction: 'up' | 'down') => {
		const { snapshot_id } = await reorderPlaylist({
			token: data?.account.accessToken,
			playlist,
			rangeStart: index,
			insertBefore: direction === 'up' ? index - 1 : index + 1,
			rangeLength: 1,
		});

		return snapshot_id;
	};

	const trackIsOutOfOrder = (index: number, track: Track) => {
		const original = playlist.tracks.items.at(index)?.track;
		if (!original) return false;

		return original.uri !== track.uri;
	};

	return (
		<ul className='flex flex-col gap-2 md:col-start-1 md:row-start-1'>
			{playlistCopy.tracks.items.map(({ track }, index) => (
				<li
					key={`${track.id}-${index}`}
					className='flex flex-col gap-1'>
					<div className='flex gap-1'>
						{index === 0 ? (
							<Badge variant='green'>Start: 00:00</Badge>
						) : (
							<Badge variant='yellow'>{getStartingTimestamp(index)}</Badge>
						)}
					</div>
					<div className='flex gap-2 items-center'>
						<div className='grid grid-rows-2 gap-1'>
							<Button
								onClick={() => handleReorder(index, 'up')}
								disabled={index === 0}
								variant='outline'
								size='icon'>
								<ArrowUp />
							</Button>
							<Button
								onClick={() => handleReorder(index, 'down')}
								disabled={index === playlistCopy.tracks.items.length - 1}
								variant='outline'
								size='icon'>
								<ArrowDown />
							</Button>
						</div>
						<TrackDetails
							track={track}
							className={cn(
								'flex-1',
								trackIsOutOfOrder(index, track) && 'border-primary'
							)}
						/>
					</div>
				</li>
			))}
			<li className='flex gap-1'>
				<Badge variant='destructive'>
					Finish: {formattedDuration(seconds, minutes, hours)}
				</Badge>
			</li>
		</ul>
	);
}
