'use client';

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth-client';

export default function Home() {
	return (
		<div>
			<Button onClick={signIn}>Sign in with Spotify</Button>
		</div>
	);
}
