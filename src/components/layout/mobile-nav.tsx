'use client';

import { useState, useCallback, ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/cn';
import { useMetaColor } from '@/hooks/use-meta-color';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import Logout from '@/components/auth/logout';

export function MobileNav() {
	const [open, setOpen] = useState(false);
	const { setMetaColor, metaColor } = useMetaColor();

	const onOpenChange = useCallback(
		(open: boolean) => {
			setOpen(open);
			setMetaColor(open ? '#09090b' : metaColor);
		},
		[setMetaColor, metaColor]
	);

	return (
		<Drawer
			open={open}
			onOpenChange={onOpenChange}>
			<DrawerTrigger asChild>
				<Button
					variant='ghost'
					className='-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth='1.5'
						stroke='currentColor'
						className='!size-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M3.75 9h16.5m-16.5 6.75h16.5'
						/>
					</svg>
					<span className='sr-only'>Toggle Menu</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent className='max-h-[60svh] p-0'>
				<DrawerHeader>
					<DrawerTitle>{siteConfig.name}</DrawerTitle>
					<DrawerDescription>Pages</DrawerDescription>
				</DrawerHeader>
				<div className='overflow-auto p-6'>
					<div className='flex flex-col space-y-2'>
						<MobileLink
							href={'/'}
							onOpenChange={setOpen}>
							Home
						</MobileLink>
					</div>
				</div>
				<DrawerFooter>
					<Logout variant='secondary' />
					<DrawerClose asChild>
						<Button variant='outline'>Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

interface MobileLinkProps extends LinkProps {
	onOpenChange?: (open: boolean) => void;
	children: ReactNode;
	className?: string;
}

function MobileLink({
	href,
	onOpenChange,
	className,
	children,
	...props
}: MobileLinkProps) {
	const router = useRouter();
	return (
		<Link
			href={href}
			onClick={() => {
				router.push(href.toString());
				onOpenChange?.(false);
			}}
			className={cn('text-base', className)}
			{...props}>
			{children}
		</Link>
	);
}
