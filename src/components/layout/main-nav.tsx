import Link from 'next/link';
// import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
// import { cn } from '@/lib/utils';

export function MainNav() {
	// const pathname = usePathname();

	return (
		<div className='mr-4 hidden md:flex'>
			<Link
				href='/'
				className='mr-4 flex items-center gap-2 lg:mr-6'>
				<span className='hidden font-bold md:inline-block'>
					{siteConfig.name}
				</span>
			</Link>
			{/* TODO: expand if more routes are added */}
			{/* <nav className='flex items-center gap-4 text-sm xl:gap-6'>
				<Link
					href='/colors'
					className={cn(
						'transition-colors hover:text-foreground/80',
						pathname?.startsWith('/colors')
							? 'text-foreground'
							: 'text-foreground/80'
					)}>
					Colors
				</Link>
			</nav> */}
		</div>
	);
}
