import { ReactNode } from 'react';
import { getCurrentSession } from '@/actions/auth';
import { SessionProvider } from '@/providers/session-provider';
import MyQueryClientProvider from '@/providers/query-client-provider';
import { PlaylistStoresProvider } from '@/providers/playlist-stores-provider';
import { ThemeProvider } from '@/providers/theme-provider';

export async function Providers({ children }: { children: ReactNode }) {
	const session = await getCurrentSession();

	return (
		<SessionProvider session={session}>
			<MyQueryClientProvider>
				<PlaylistStoresProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
						enableColorScheme>
						{children}
					</ThemeProvider>
				</PlaylistStoresProvider>
			</MyQueryClientProvider>
		</SessionProvider>
	);
}
