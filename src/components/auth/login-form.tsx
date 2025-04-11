import { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { Card, CardContent } from '@/components/ui/card';
import { Login } from '@/components/auth/login';
import { siteConfig } from '@/config/site';
import Image from 'next/image';

export function LoginForm({ className, ...props }: ComponentProps<'div'>) {
	return (
		<Card
			className={cn('overflow-hidden', className)}
			{...props}>
			<CardContent className='grid p-0 md:grid-cols-2 items-center max-h-[750px] max-w-[1000px]'>
				<Image
					priority
					height={1000}
					width={1000}
					src='/myrunningplaylist.jpg'
					alt='My Running Playlist'
					className='object-cover max-h-[500px]'
				/>

				<div className='p-6 md:p-8'>
					<div className='flex flex-col gap-6'>
						<div className='flex flex-col items-center text-center'>
							<h1 className='text-2xl md:text-4xl font-bold'>
								{siteConfig.name}
							</h1>
							<p className='text-balance md:text-xl text-muted-foreground'>
								Log in to get started
							</p>
						</div>
						<Login className='max-w-sm self-center' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
