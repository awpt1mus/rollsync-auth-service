import { Injectable } from "@nestjs/common";
import { UpdateResult } from "kysely";
import { RegisterDto } from "src/auth/dtos/register.dto";
import type { GoogleUserPayload, UserEntity } from "../dtos/custom.types";
import { DatabaseConnectionService } from "../services/connection.service";

export interface IUserRepository {
	findByEmail: (email: string) => Promise<UserEntity>;
	findById: (id: string) => Promise<UserEntity>;
	insertUser: (dto: RegisterDto) => Promise<Pick<UserEntity, "id">>;
	updateAttempts: (userId: string, attempts: number) => Promise<UpdateResult>;
	insertGoogleUser: (dto: GoogleUserPayload) => Promise<UserEntity>;
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

	async insertGoogleUser(dto: GoogleUserPayload) {
		return this.databaseService.db
			.insertInto("user")
			.values({
				firstname: dto.firstname,
				lastname: dto.lastname,
				avatar_url: dto.picture,
				google_id: dto.googleId,
				email: dto.email,
				username: dto.username,
			})
			.returningAll()
			.executeTakeFirst();
	}
}
