'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Error({
	error,
}: {
	error: Error & { digest?: string };
}) {
	return (
		<div className='flex-col-full w-full justify-center items-center'>
			<Alert
				variant='destructive'
				className='md:max-w-xl'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Something went wrong.</AlertTitle>
				<AlertDescription>{error.message}</AlertDescription>
			</Alert>
		</div>
	);
}
