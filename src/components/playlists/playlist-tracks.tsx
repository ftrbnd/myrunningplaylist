'use client';

import { formattedDuration, getDuration } from '@/lib/utils';
import { Playlist, Track } from '@spotify/web-api-ts-sdk';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrackDetails from '@/components/playlists/track-details';
import { reorderPlaylist } from '@/services/spotify';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
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
		if (isReordered) {
			toast('Save changes?', {
				duration: Infinity,
				action: {
					label: 'Save',
					onClick: () => console.log('TODO: implement'),
				},
			});
		} else {
			toast.dismiss();
		}
	}, [isReordered]);

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
		const reorder = reorderPlaylist({
			token: data?.account.accessToken,
			playlist,
			rangeStart: index,
			insertBefore: direction === 'up' ? index - 1 : index + 1,
			rangeLength: 1,
		});

		toast.promise(reorder, {
			loading: 'Reordering...',
			success: (data) => {
				return `Reordered playlist snapshot#${data.snapshot_id} `;
			},
			error: 'Error',
		});
	};

	return (
		<ul className='flex flex-col gap-2 md:col-start-1 md:row-start-1'>
			{playlistCopy.tracks.items.map(({ track }, i) => (
				<li
					key={`${track.id}-${i}`}
					className='flex flex-col gap-1'>
					<div className='flex gap-1'>
						{i === 0 ? (
							<Badge variant='green'>Start: 00:00</Badge>
						) : (
							<Badge variant='yellow'>{getStartingTimestamp(i)}</Badge>
						)}
					</div>
					<div className='flex gap-2 items-center'>
						<div className='grid grid-rows-2 gap-1'>
							<Button
								onClick={() => handleReorder(i, 'up')}
								disabled={i === 0}
								variant='outline'
								size='icon'>
								<ArrowUp />
							</Button>
							<Button
								onClick={() => handleReorder(i, 'down')}
								disabled={i === playlistCopy.tracks.items.length - 1}
								variant='outline'
								size='icon'>
								<ArrowDown />
							</Button>
						</div>
						<TrackDetails
							track={track}
							className='flex-1'
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
