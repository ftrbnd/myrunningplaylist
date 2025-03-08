import { TrackSkeletons } from '@/components/playlists/track-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div>
			<div className='flex flex-col md:flex-row gap-2 justify-between items-center w-full mb-2'>
				<div className='flex gap-4 items-center w-full md:w-auto'>
					<Skeleton className='h-24 w-24 rounded-md' />
					<Skeleton className='h-9 lg:h-12 w-64' />
				</div>
				<div className='text-muted-foreground flex items-center self-start md:self-center'>
					Total runtime:
					<Skeleton className='ml-2 h-6 w-44' />
				</div>
			</div>
			<div className='flex flex-col gap-2 md:grid md:grid-cols-2'>
				<Card className=' h-min w-full md:w-min md:col-start-2 md:row-start-1 md:justify-self-end'>
					<CardHeader>
						<CardTitle className='scroll-m-20 text-xl font-semibold tracking-tight'>
							Select your race
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Skeleton className='h-64 w-64 rounded-md' />
					</CardContent>
				</Card>
				<TrackSkeletons />
			</div>
		</div>
	);
}
