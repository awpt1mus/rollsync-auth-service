import { Inject, Injectable } from "@nestjs/common";
import { DB_CONNECTION } from "../connection.provider";
import type { Kysely, Selectable } from "kysely";
import type { DB, User } from "../generated.types";

export type UserEntity = Selectable<User>;

export interface IUserRepository {
  findByEmail: (email: string) => Promise<UserEntity>;
  findById: (id: string) => Promise<UserEntity>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly db: Kysely<DB>;

  constructor(@Inject(DB_CONNECTION) db: Kysely<DB>) {
    this.db = db;
  }

  async findByEmail(email: string) {
    return this.db
      .selectFrom("user")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst();
  }

  async findById(id: string) {
    return this.db
      .selectFrom("user")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst();
  }
}
