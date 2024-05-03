import { Insertable, Selectable, Updateable } from "kysely";
import { RefreshToken, User } from "./generated.types";

export type UserEntity = Selectable<User>;
export type InsertUserEntity = Insertable<User>;
export type UpdateUserEntity = Updateable<User>;

export type RefreshTokenEntity = Selectable<RefreshToken>;
export type InsertRefreshTokenEntity = Insertable<RefreshToken>;

export interface GoogleUserPayload {
	email: string;
	firstname: string;
	lastname?: string;
	username?: string;
	picture?: string;
	googleId: string;
}
