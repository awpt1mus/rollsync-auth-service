import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { UserEntity } from "src/database/dtos/custom.types";

export type TokenPayload = Pick<UserEntity, "id" | "email">;

export interface TokenValidationResult {
	success: boolean;
	payload: TokenPayload | null;
}

export class RefreshTokenRequestDto {
	@ApiProperty({ description: "refresh token" })
	@IsString({ message: "refresh token must be a string" })
	@IsNotEmpty({ message: "refresh token is required" })
	refresh_token: string;
}

export class RefreshTokenRequestSuccessDto {
	@ApiProperty({ description: "access token" })
	access_token: string;
}
