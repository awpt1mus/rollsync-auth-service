import { z } from "zod";

export const EnvironmentVariablesSchema = z.object({
  port: z.coerce.number().safe().min(0).max(65535),
  secret: z.string().min(1),
  db_user: z.string().min(1),
  db_pass: z.string().min(1),
  db_name: z.string().min(1),
  db_port: z.coerce.number().safe().min(0).max(65535),
  db_host: z.string().min(1),
});

export interface AppConfig {
  port: number;
  jwtSecret: string;
  database: {
    port: number;
    name: string;
    host: string;
    user: string;
    password: string;
  };
}
