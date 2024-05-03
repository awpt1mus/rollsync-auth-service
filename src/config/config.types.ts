import { z } from "zod";

export const EnvironmentVariablesSchema = z.object({
	port: z.coerce.number().safe().min(0).max(65535),
	access_token_secret: z.string().min(1),
	refresh_token_secret: z.string().min(1),
	db_user: z.string().min(1),
	db_pass: z.string().min(1),
	db_name: z.string().min(1),
	db_port: z.coerce.number().safe().min(0).max(65535),
	db_host: z.string().min(1),
	google_android_client_id: z.string().min(1),
	google_ios_client_id: z.string().min(1),
});

export interface DatabaseConfig {
	port: number;
	name: string;
	host: string;
	user: string;
	password: string;
}

export interface GoogleClientIdConfig {
	android: string;
	ios: string;
}

export interface AppConfig {
	port: number;
	accessTokenSecret: string;
	refreshTokenSecret: string;
	database: DatabaseConfig;
	googleClientIdConfig: GoogleClientIdConfig;
}
