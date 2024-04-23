import { type AppConfig, EnvironmentVariablesSchema } from "./config.types";

export default function loadConfig(): AppConfig {
  const config: Record<string, string | number | undefined> = {
    port: process.env.PORT,
    secret: process.env.SECRET,
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    db_name: process.env.DB_NAME,
    db_port: process.env.DB_PORT,
    db_host: process.env.DB_HOST,
  };

  const configValidationResult = EnvironmentVariablesSchema.safeParse(config);

  if (!configValidationResult.success) {
    throw new Error(
      `invalid configuration \n ${JSON.stringify(configValidationResult.error, null, 2)}`
    );
  }

  const { port, secret, db_host, db_name, db_pass, db_port, db_user } =
    configValidationResult.data;

  return {
    port,
    jwtSecret: secret,
    database: {
      host: db_host,
      name: db_name,
      password: db_pass,
      port: db_port,
      user: db_user,
    },
  };
}
