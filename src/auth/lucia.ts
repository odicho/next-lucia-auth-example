import { Lucia } from 'lucia';
import { GitHub } from 'arctic';
import { drizzleAdapter } from '@/db';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const lucia = new Lucia(drizzleAdapter, {
	getSessionAttributes: (attributes) => {
		return {};
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
		};
	},
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === 'production',
		},
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
	}
	// interface DatabaseSessionAttributes {}
	interface DatabaseUserAttributes {
		username: string;
	}
}

export const githubAuth = new GitHub(
	process.env.GITHUB_CLIENT_ID ?? '',
	process.env.GITHUB_CLIENT_SECRET ?? '',
);

export const getUser = cache(async () => {
	const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
	if (!sessionId) return null;
	const { session, user } = await lucia.validateSession(sessionId);
	try {
		if (session?.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	} catch {
		// Next.js throws error when attempting to set cookies when rendering page
	}
	return user;
});
