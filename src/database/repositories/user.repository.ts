import { Injectable } from "@nestjs/common";
import { Selectable, UpdateResult } from "kysely";
import { RegisterDto } from "src/auth/dtos/register.dto";
import type { User } from "../generated.types";
import { DatabaseConnectionService } from "../services/connection.service";

export type UserEntity = Selectable<User>;

export interface IUserRepository {
	findByEmail: (email: string) => Promise<UserEntity>;
	findById: (id: string) => Promise<UserEntity>;
	insertUser: (dto: RegisterDto) => Promise<Pick<UserEntity, "id">>;
	updateAttempts: (userId: string, attempts: number) => Promise<UpdateResult>;
}

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(private readonly databaseService: DatabaseConnectionService) {}

	async findByEmail(email: string) {
		return this.databaseService.db
			.selectFrom("user")
			.where("email", "=", email)
			.selectAll()
			.executeTakeFirst();
	}

	async findById(id: string) {
		return this.databaseService.db
			.selectFrom("user")
			.where("id", "=", id)
			.selectAll()
			.executeTakeFirst();
	}

	async insertUser(dto: RegisterDto) {
		return this.databaseService.db
			.insertInto("user")
			.values(dto)
			.returning("id")
			.executeTakeFirst();
	}

	async updateAttempts(userId: string, attempts: number) {
		return this.databaseService.db
			.updateTable("user")
			.set("attempts", attempts)
			.where("id", "=", userId)
			.executeTakeFirst();
	}
}
