import { githubAuth } from '@/auth/lucia';
import { generateState } from 'arctic';
import * as context from 'next/headers';

export const GET = async () => {
	const state = generateState();

	const authorizationURL = await githubAuth.createAuthorizationURL(state);

	// store state
	context.cookies().set('github_oauth_state', state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 60 * 60,
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: authorizationURL.toString(),
		},
	});
};
