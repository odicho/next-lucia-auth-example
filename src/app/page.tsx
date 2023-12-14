// import { getPageSession } from '@/auth/lucia';
import { redirect } from 'next/navigation';

import Form from '@/components/form'; // expect error - see next section
import { getUser } from '@/auth/lucia';

const Page = async () => {
	const user = await getUser();
	if (!user) redirect('/login');
	return (
		<>
			<h1>Profile</h1>
			<p>User id: {user.id}</p>
			<p>Username: {user.username}</p>
			<Form action="/api/logout">
				<input type="submit" value="Sign out" />
			</Form>
		</>
	);
};

export default Page;
