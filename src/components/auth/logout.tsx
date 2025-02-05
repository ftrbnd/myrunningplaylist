'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const { useSession, signOut } = authClient;

export default function Logout() {
	const router = useRouter();
	const { data } = useSession();

	const handleLogout = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push('/login');
				},
			},
		});
	};

	if (!data?.session) return null;

	return (
		<Button
			onClick={handleLogout}
			variant='outline'>
			<Avatar className='h-6 w-6'>
				{data?.user.image ? (
					<AvatarImage
						src={data.user.image}
						alt={data.user.name}
					/>
				) : (
					<AvatarFallback>{data?.user.name[0].toUpperCase()}</AvatarFallback>
				)}
			</Avatar>
			Log out
		</Button>
	);
}
