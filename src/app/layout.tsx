import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { META_THEME_COLORS, siteConfig } from '@/config/site';
import { SiteHeader } from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import { cn } from '@/lib/utils';
import MyQueryClientProvider from '@/providers/query-client-provider';

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

export default function RootLayout({
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
				<MyQueryClientProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
						enableColorScheme>
						<div vaul-drawer-wrapper=''>
							<div className='relative flex min-h-svh flex-col bg-background'>
								<div
									data-wrapper=''
									className='border-grid flex flex-1 flex-col'>
									<SiteHeader />
									<main className='flex flex-1 flex-col p-4'>{children}</main>
									<SiteFooter />
								</div>
							</div>
						</div>
					</ThemeProvider>
				</MyQueryClientProvider>
			</body>
		</html>
	);
}
