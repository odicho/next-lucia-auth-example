import { githubAuth, lucia } from '@/auth/lucia';
import { db } from '@/db';
import { oauth_account, user } from '@/db/schema';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { createId } from '@paralleldrive/cuid2';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
	const storedState = cookies().get('github_oauth_state')?.value;
	const url = new URL(request.url);
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const tokens = await githubAuth.validateAuthorizationCode(code);

		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		const githubUser: GitHubUserResult = await githubUserResponse.json();

		const existingUserResponse = await db
			.select()
			.from(oauth_account)
			.where(
				and(
					eq(oauth_account.providerId, 'github'),
					eq(oauth_account.providerUserId, githubUser.id.toString()),
				),
			);

		const existingUser = existingUserResponse[0];

		if (existingUser) {
			const session = await lucia.createSession(existingUser.userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			return new Response(null, {
				status: 302,
				headers: {
					Location: '/',
					'Set-Cookie': sessionCookie.serialize(),
				},
			});
		}

		const userId = createId();
		await db.transaction(async (tx) => {
			await tx.insert(user).values({ id: userId, username: githubUser.login });
			await tx
				.insert(oauth_account)
				.values({ providerId: 'github', providerUserId: githubUser.id.toString(), userId: userId });
		});

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
				'Set-Cookie': sessionCookie.serialize(),
			},
		});
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400,
			});
		}
		return new Response(null, {
			status: 500,
		});
	}
};

interface GitHubUserResult {
	id: number;
	login: string;
}
