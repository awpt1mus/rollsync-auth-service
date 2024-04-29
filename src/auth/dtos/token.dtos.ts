import { UserEntity } from "src/database/dtos/custom.types";

export type TokenPayload = Pick<UserEntity, "id" | "email">;

export interface TokenValidationResult {
	success: boolean;
	payload: TokenPayload | null;
}
