import { getUser } from '@/auth/lucia';
import { redirect } from 'next/navigation';

const Page = async () => {
	const user = await getUser();
	if (user) redirect('/');
	return (
		<>
			<h1>Sign in</h1>
			<a href="/login/github">Sign in with GitHub</a>
		</>
	);
};

export default Page;
