import { Button } from '@/components/ui/button';
import { Icons } from '@/components/layout/icons';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function Login(props: ComponentProps<'button'>) {
	return (
		<Button
			asChild
			className={cn('w-full', props.className)}
			{...props}>
			<Link href='/login/spotify'>
				<Icons.spotify />
				Continue with Spotify
			</Link>
		</Button>
	);
}
