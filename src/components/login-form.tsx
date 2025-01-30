import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import SiteFooter from './site-footer';
import Image from 'next/image';
import Login from './login';

export function LoginForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('flex flex-col gap-6', className)}
			{...props}>
			<Card className='overflow-hidden'>
				<CardContent className='grid p-0 md:grid-cols-2'>
					<div className='p-6 md:p-8'>
						<div className='flex flex-col gap-6'>
							<div className='flex flex-col items-center text-center'>
								<h1 className='text-2xl font-bold'>My Running Playlist</h1>
								<p className='text-balance text-muted-foreground'>
									Log in to get started
								</p>
							</div>
							<Login />
						</div>
					</div>

					<div className='relative hidden bg-muted md:block'>
						<Image
							src='/placeholder.svg'
							alt='TODO: Add image'
							width={100}
							height={100}
							className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
						/>
					</div>
				</CardContent>
			</Card>

			<SiteFooter />
		</div>
	);
}
