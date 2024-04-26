import { UserEntity } from "src/database/repositories/user.repository";

export type TokenPayload = Pick<UserEntity, "id" | "email">;

export interface TokenValidationResult {
	success: boolean;
	payload: TokenPayload | null;
}
