import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { AppConfig, DatabaseConfig } from "src/config/config.types";
import { DB } from "./generated.types";

@Injectable()
export class DatabaseConnectionService
	implements OnModuleInit, OnModuleDestroy
{
	public db: Kysely<DB>;

	constructor(private readonly configService: ConfigService<AppConfig>) {}

	onModuleDestroy() {
		this.db?.destroy();
	}
	onModuleInit() {
		const { name, user, password, host, port } =
			this.configService.get<DatabaseConfig>("database");

		const dialect = new PostgresDialect({
			pool: new Pool({
				database: name,
				host,
				user,
				password,
				port,
				max: 10,
			}),
		});

		const db = new Kysely<DB>({
			dialect,
		});

		this.db = db;
	}
}
