/// <reference types="lucia" />

declare namespace Lucia {
	type Auth = import('./src/auth/lucia').Auth;
	type DatabaseUserAttributes = Omit<import('@/db/schema').User, 'id'>;
	type DatabaseSessionAttributes = {};
}
