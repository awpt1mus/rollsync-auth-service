import { Insertable, Selectable, Updateable } from "kysely";
import { User } from "./generated.types";

export type UserEntity = Selectable<User>;
export type InsertUserEntity = Insertable<User>;
export type UpdateUserEntity = Updateable<User>;
