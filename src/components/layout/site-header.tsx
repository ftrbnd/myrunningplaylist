import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { Icons } from '@/components/layout/icons';
import { MainNav } from '@/components/layout/main-nav';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Logout from '@/components/auth/logout';

export async function SiteHeader() {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});

	return (
		<header className='border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container-wrapper'>
				<div className='container flex h-14 items-center'>
					<MainNav />
					<MobileNav />
					<div className='flex flex-1 items-center gap-2 justify-end'>
						<nav className='flex items-center gap-0.5'>
							{session?.session && <Logout className='hidden md:inline-flex' />}
							<Button
								variant='ghost'
								size='icon'
								className='h-8 w-8 px-0'>
								<Link
									href={siteConfig.links.github}
									target='_blank'
									rel='noreferrer'>
									<Icons.gitHub className='h-4 w-4' />
									<span className='sr-only'>GitHub</span>
								</Link>
							</Button>
							<ThemeToggle />
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
}
