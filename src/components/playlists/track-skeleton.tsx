import { Skeleton } from '@/components/ui/skeleton';

function TrackSkeleton() {
	return (
		<div className='bg-card flex items-center space-x-4 rounded-md border p-4 md:max-w-xl'>
			<Skeleton className='w-16 h-16 rounded-md' />

			<div className='flex-1 space-y-1'>
				<Skeleton className='h-8 w-32' />
				<Skeleton className='h-4 w-20' />
			</div>

			<Skeleton className='h-8 w-24' />
			<Skeleton className='h-8 w-12' />
		</div>
	);
}

export function TrackSkeletons() {
	return (
		<ul className='flex flex-col gap-2 md:col-start-1 md:row-start-1'>
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
				<li
					key={v}
					className='h-full'>
					<TrackSkeleton />
				</li>
			))}
		</ul>
	);
}
