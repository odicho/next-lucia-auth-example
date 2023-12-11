import { poolConnection } from '@/db';
import { mysql2 } from '@lucia-auth/adapter-mysql';
import { lucia } from 'lucia';
import { nextjs_future } from 'lucia/middleware';
import { github } from '@lucia-auth/oauth/providers';
import { cache } from 'react';
import * as context from 'next/headers';

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';

export const auth = lucia({
	env,
	adapter: mysql2(poolConnection, {
		user: 'auth_user',
		key: 'user_key',
		session: 'user_session',
	}),
	middleware: nextjs_future(),
	sessionCookie: {
		expires: false,
	},
	getUserAttributes: (databaseUser) => {
		return {
			username: databaseUser.username,
		};
	},
});

export const githubAuth = github(auth, {
	clientId: process.env.GITHUB_CLIENT_ID ?? '',
	clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
});

export type Auth = typeof auth;

export const getPageSession = cache(() => {
	const authRequest = auth.handleRequest('GET', context);
	return authRequest.validate();
});
