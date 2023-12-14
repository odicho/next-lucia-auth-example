import { getUser, lucia } from '@/auth/lucia';
import { verifyRequestOrigin } from 'lucia';
import { headers } from 'next/headers';

import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
	const originHeader = headers().get('Origin');
	const hostHeader = headers().get('Host');

	if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
		return new Response(null, {
			status: 403,
		});
	}

	const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;

	if (!sessionId) {
		return new Response(null, {
			status: 401,
		});
	}

	const { user } = await lucia.validateSession(sessionId);

	if (!user) {
		return new Response(null, {
			status: 401,
		});
	}

	await lucia.invalidateSession(sessionId);
	const blankSessionCookie = lucia.createBlankSessionCookie();

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/login', // redirect to login page
			'Set-Cookie': blankSessionCookie.serialize(),
		},
	});
};
