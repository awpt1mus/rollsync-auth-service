import type { FactoryProvider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { DatabaseConfig, AppConfig } from "src/config/config.types";
import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "./generated.types";
import { Pool } from "pg";

export const DB_CONNECTION = "CONNECTION";

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
