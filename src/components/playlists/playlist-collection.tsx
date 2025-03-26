'use client';

import PlaylistCard from '@/components/playlists/playlist-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	MoreHorizontal,
} from 'lucide-react';
import { usePlaylists } from '@/hooks/use-playlists';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

export default function PlaylistCollection() {
	const { playlists, getPreviousUrl, getNextUrl, getFirstUrl } = usePlaylists();

	if (!playlists || playlists.length === 0)
		return (
			<Alert className='md:max-w-xl'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>No playlists were found.</AlertTitle>
				<AlertDescription>Try again later.</AlertDescription>
			</Alert>
		);

	return (
		<div className='flex flex-col gap-4'>
			<ul className='card-grid'>
				{playlists.map((playlist, i) => (
					<li
						key={`${playlist.id}-${i}`}
						className='h-full'>
						<PlaylistCard playlist={playlist} />
					</li>
				))}
			</ul>
			<Pagination>
				<PaginationContent>
					<PaginationItem className='text-primary'>
						<Button
							onClick={getPreviousUrl}
							variant='ghost'
							aria-label='Go to previous page'
							className='gap-1 pl-2.5'>
							<ChevronLeft className='h-4 w-4' />
							Previous
						</Button>
					</PaginationItem>
					<PaginationItem className='text-primary'>
						<Button
							onClick={getFirstUrl}
							variant='ghost'
							aria-label='Go to first page'>
							1
						</Button>
					</PaginationItem>
					<PaginationItem className='text-primary'>
						<span
							aria-hidden
							className='flex h-9 w-9 items-center justify-center'>
							<MoreHorizontal className='h-4 w-4' />
							<span className='sr-only'>More pages</span>
						</span>
					</PaginationItem>
					<PaginationItem className='text-primary'>
						<Button
							onClick={getNextUrl}
							variant='ghost'
							aria-label='Go to next page'
							className='gap-1 pl-2.5'>
							Next
							<ChevronRight className='h-4 w-4' />
						</Button>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
