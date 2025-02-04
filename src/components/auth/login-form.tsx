import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import Login from '@/components/auth/login';
import Image from 'next/image';
import { siteConfig } from '@/config/site';

export function LoginForm({ className, ...props }: ComponentProps<'div'>) {
	return (
		<Card
			className={cn('overflow-hidden', className)}
			{...props}>
			<CardContent className='grid p-0 md:grid-cols-2'>
				<div className='p-6 md:p-8'>
					<div className='flex flex-col gap-6'>
						<div className='flex flex-col items-center text-center'>
							<h1 className='text-2xl font-bold'>{siteConfig.name}</h1>
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
	);
}
