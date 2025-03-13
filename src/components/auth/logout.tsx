'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// TODO: replace
function useSession() {
	return {
		user: {
			image: 'fakeimage',
			name: 'fakename',
		},
	};
}

export default function Logout(props: ButtonProps) {
	const session = useSession();

	const handleLogout = async () => {
		// await signOut()
	};

	// if (!data?.session) return null;

	return (
		<Button
			onClick={handleLogout}
			variant='outline'
			{...props}>
			<Avatar className='h-6 w-6'>
				{session?.user.image ? (
					<AvatarImage
						src={session.user.image}
						alt={session.user.name}
					/>
				) : (
					<AvatarFallback>{session?.user.name[0].toUpperCase()}</AvatarFallback>
				)}
			</Avatar>
			Log out
		</Button>
	);
}
