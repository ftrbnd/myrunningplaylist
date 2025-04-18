import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { META_THEME_COLORS, siteConfig } from '@/config/site';
import { SiteHeader } from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import { cn } from '@/lib/cn';
import { Providers } from '@/providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
			// TODO: https://github.com/shadcn-ui/ui/issues/5552
		>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
					}}
				/>
			</head>
			<body
				className={cn(
					'min-h-svh bg-background font-sans antialiased',
					geistSans.variable,
					geistMono.variable
				)}>
				<Providers>
					<div vaul-drawer-wrapper=''>
						<div className='relative flex min-h-svh flex-col bg-background'>
							<div
								data-wrapper=''
								className='border-grid flex-col-full'>
								<SiteHeader />
								<div className='container-wrapper flex-col-full'>
									<div className='container py-4 flex-col-full'>
										<main className='md:p-4 flex-col-full'>{children}</main>
									</div>
								</div>
								<SiteFooter />
							</div>
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
