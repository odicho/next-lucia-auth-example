/// <reference types="lucia" />

import { Session, User } from '@/db/schema';

declare namespace Lucia {
	type Auth = import('./src/auth/lucia').Auth;
	type DatabaseUserAttributes = Omit<User, 'id'>;
	type DatabaseSessionAttributes = Session;
}
