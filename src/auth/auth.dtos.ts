import { UserEntity } from "src/database/repositories/user.repository";
import { z } from "zod";

export const EmailSchema = z
	.string()
	.min(1, { message: "email is required" })
	.email({ message: "email must be valid email address" });
export const PasswordSchema = z.string().min(6, {
	message: "password is required and must be atleast 6 characters long",
});

export const LoginRequestSchema = z.object({
	email: EmailSchema,
	password: PasswordSchema,
});

export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;

export const SignUpRequestSchema = z.object({
	email: EmailSchema,

	firstname: z
		.string()
		.min(1, { message: "firstname is required" })
		.max(200, { message: "firstname must be at most 200 characters" })
		.regex(/^[a-zA-Z]+$/, {
			message: "firstname can only contain letters(a-z)",
		}),

	lastname: z
		.string()
		.min(1, { message: "lastname cannot be empty" })
		.max(200, { message: "lastname must be at most 200 characters" })
		.regex(/^[a-zA-Z]+$/, {
			message: "lastname can only contain letters(a-z)",
		})
		.optional(),

	username: z
		.string()
		.min(1, { message: "username cannot be empty" })
		.max(20, { message: "lastname must be at most 20 characters" })
		.regex(/^[a-zA-Z0-9_]+$/, {
			message:
				"username can only contain letters(a-z), numbers(0-9) and underscores(-)",
		})
		.optional(),

	password: PasswordSchema,
});

export type SignUpRequestDTO = z.infer<typeof SignUpRequestSchema>;

export interface LoginSuccessDto
	extends Pick<
		UserEntity,
		"id" | "email" | "firstname" | "lastname" | "username" | "avatar_url"
	> {
	access_token: string;
}

export type TokenPayload = Pick<UserEntity, "id" | "email">;

export interface TokenValidationResult {
	success: boolean;
	payload: TokenPayload | null;
}
