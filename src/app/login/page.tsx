import Login from '@/components/auth/login';
import { getCurrentSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function Page() {
	const { user } = await getCurrentSession();
	if (user) return redirect('/');

	return <Login />;
}
