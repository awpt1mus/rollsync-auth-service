import { ConfigService } from "@nestjs/config";
import { RootModule } from "../../root/root.module";
import { NestFactory } from "@nestjs/core";
import { AppConfig, DatabaseConfig } from "src/config/config.types";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "../dtos/generated.types";
import { InsertUserEntity } from "../dtos/custom.types";
import { hash } from "argon2";

async function main() {
	const app = await NestFactory.create(RootModule);

	const configService = app.get(ConfigService<AppConfig>);

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

	//delete all users.
	await db.deleteFrom("user").execute();

	const users: InsertUserEntity = [
		{
			email: "john@gmail.com",
			password: await hash("abc123"),
			firstname: "john",
		},
		{
			email: "bob@example.com",
			password: await hash("abc123"),
			firstname: "bob",
		},
	];

	await db.insertInto("user").values(users).execute();
}

main();
