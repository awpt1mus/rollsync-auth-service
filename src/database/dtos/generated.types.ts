import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface RefreshToken {
	expiry: Timestamp;
	id: Generated<string>;
	value: string;
}

export interface User {
	attempts: Generated<number | null>;
	avatar_url: string | null;
	created_at: Generated<Timestamp | null>;
	email: string;
	firstname: string;
	google_id: string | null;
	id: Generated<string>;
	lastname: string | null;
	password: string | null;
	updated_at: Generated<Timestamp | null>;
	username: string | null;
	verified: Generated<boolean | null>;
}

export interface DB {
	refresh_token: RefreshToken;
	user: User;
}
