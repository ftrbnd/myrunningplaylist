import { Button, ButtonProps } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { logout } from '@/actions';
import { User } from '@/lib/db/schema';

interface Props extends ButtonProps {
	user?: User;
}

export function Logout(props: Props) {
	return (
		<Button
			asChild
			onClick={logout}
			variant='outline'
			{...props}>
			<Link href='/'>
				<Avatar className='h-6 w-6'>
					{props.user?.avatar ? (
						<AvatarImage
							src={props.user?.avatar[0]}
							alt={props.user?.displayName}
						/>
					) : (
						<AvatarFallback>
							{props.user?.displayName[0].toUpperCase()}
						</AvatarFallback>
					)}
				</Avatar>
				Log out
			</Link>
		</Button>
	);
}
