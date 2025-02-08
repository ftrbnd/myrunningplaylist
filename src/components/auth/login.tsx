'use client';

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth-client';
import { Icons } from '@/components/layout/icons';

export default function Login() {
	return (
		<Button
			onClick={signIn}
			className='w-full'>
			<Icons.spotify />
			Continue with Spotify
		</Button>
	);
}
