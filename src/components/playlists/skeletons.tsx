import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardDescription } from '../ui/card';

function SkeletonCard() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className='h-4 w-[300px]' />
				<CardDescription className='text-sm flex flex-row items-center'>
					<Skeleton className='h-4 w-8 mr-1' />
					tracks
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Skeleton className='h-80 w-80' />
			</CardContent>
		</Card>
	);
}

export default function PlaylistSkeletonCards() {
	return (
		<ul className='flex flex-col md:grid md:grid-cols-2 gap-4'>
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
				<li
					key={v}
					className='h-full'>
					<SkeletonCard />
				</li>
			))}
		</ul>
	);
}
