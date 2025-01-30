'use client';

import { authClient } from '@/lib/auth-client';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function Logout() {
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push('/login');
				},
			},
		});
	};

	return <Button onClick={handleLogout}>Log out</Button>;
}
