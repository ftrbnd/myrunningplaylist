import { Button } from '@/components/ui/button';
import { Icons } from '@/components/layout/icons';
import Link from 'next/link';

export function Login() {
	return (
		<Button
			asChild
			className='w-full'>
			<Link href='/login/spotify'>
				<Icons.spotify />
				Continue with Spotify
			</Link>
		</Button>
	);
}
