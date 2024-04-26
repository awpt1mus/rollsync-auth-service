import { Inject, Injectable } from "@nestjs/common";
import type { Kysely, Selectable, UpdateResult } from "kysely";
import { SignUpRequestDTO } from "src/auth/auth.dtos";
import { DB_CONNECTION } from "../connection.provider";
import type { DB, User } from "../generated.types";

export type UserEntity = Selectable<User>;

export interface IUserRepository {
	findByEmail: (email: string) => Promise<UserEntity>;
	findById: (id: string) => Promise<UserEntity>;
	insertUser: (dto: SignUpRequestDTO) => Promise<Pick<UserEntity, "id">>;
	updateAttempts: (userId: string, attempts: number) => Promise<UpdateResult>;
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

	async insertUser(dto: SignUpRequestDTO) {
		return this.db
			.insertInto("user")
			.values(dto)
			.returning("id")
			.executeTakeFirst();
	}

	async updateAttempts(userId: string, attempts: number) {
		return this.db
			.updateTable("user")
			.set("attempts", attempts)
			.where("id", "=", userId)
			.executeTakeFirst();
	}
}
