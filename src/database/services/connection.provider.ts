import type { FactoryProvider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { AppConfig, DatabaseConfig } from "src/config/config.types";
import type { DB } from "../generated.types";

export const DB_CONNECTION = "CONNECTION";

/**
 * @deprecated Use DatabaseConnectionService instead
 */
export const connectionProvider: FactoryProvider = {
	provide: DB_CONNECTION,
	useFactory: (configService: ConfigService<AppConfig>) => {
		const { name, user, password, host, port } =
			configService.get<DatabaseConfig>("database");

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

		return db;
	},
	inject: [ConfigService],
};
