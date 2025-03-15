import { getCurrentSession } from '@/actions/auth';
import { LoginForm } from '@/components/auth/login-form';
import { redirect } from 'next/navigation';

export default async function Page() {
	const { user } = await getCurrentSession();
	if (user) return redirect('/');

	return (
		<div className='flex-col-full items-center justify-center'>
			<LoginForm />
		</div>
	);
}
