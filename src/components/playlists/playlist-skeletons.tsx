import { Skeleton } from '@/components/ui/skeleton';

function PlaylistSkeleton() {
	return (
		<div className='playlist-card'>
			<Skeleton className='h-16 w-16 md:h-32 md:w-32' />
			<div className='flex-1 space-y-1'>
				<Skeleton className='h-4 w-[250px] md:w-[200px]' />
				<div className='text-sm flex flex-row items-center'>
					<Skeleton className='h-4 w-8 mr-1' />
					tracks
				</div>
			</div>
		</div>
	);
}

export function PlaylistSkeletons() {
	return (
		<ul className='card-grid'>
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
				<li
					key={v}
					className='h-full'>
					<PlaylistSkeleton />
				</li>
			))}
		</ul>
	);
}
