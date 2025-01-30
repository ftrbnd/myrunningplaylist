'use client';

import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../ui/button';
import { signIn } from '@/lib/auth-client';

export default function Login() {
	return (
		<Button
			onClick={signIn}
			className='w-full'>
			<FontAwesomeIcon icon={faSpotify} />
			Continue with Spotify
		</Button>
	);
}
