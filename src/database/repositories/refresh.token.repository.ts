import { Injectable } from "@nestjs/common";
import {
	InsertRefreshTokenEntity,
	RefreshTokenEntity,
} from "../dtos/custom.types";
import { DatabaseConnectionService } from "../services/connection.service";

export interface IRefreshTokenRepository {
	findTokenByValue: (value: string) => Promise<RefreshTokenEntity | undefined>;
	insertToken: (value: string) => Promise<void>;
	removeToken: (id: string) => Promise<void>;
}

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
	constructor(private readonly databaseService: DatabaseConnectionService) {}

	async insertToken(payload: InsertRefreshTokenEntity) {
		await this.databaseService.db
			.insertInto("refresh_token")
			.values(payload)
			.executeTakeFirst();
	}

	async findTokenByValue(value: string) {
		return this.databaseService.db
			.selectFrom("refresh_token")
			.where("value", "=", value)
			.selectAll()
			.executeTakeFirst();
	}

	async removeToken(id: string) {
		await this.databaseService.db
			.deleteFrom("refresh_token")
			.where("id", "=", id)
			.executeTakeFirst();
	}
}
