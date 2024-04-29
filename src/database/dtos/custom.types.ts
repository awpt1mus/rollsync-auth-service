import { Insertable, Selectable, Updateable } from "kysely";
import { RefreshToken, User } from "./generated.types";

export type UserEntity = Selectable<User>;
export type InsertUserEntity = Insertable<User>;
export type UpdateUserEntity = Updateable<User>;

export type RefreshTokenEntity = Selectable<RefreshToken>;
export type InsertRefreshTokenEntity = Insertable<RefreshToken>;
