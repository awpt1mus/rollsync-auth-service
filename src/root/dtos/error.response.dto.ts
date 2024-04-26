import { ApiProperty } from "@nestjs/swagger";

export class UnAuthorizedResponseDto {
	@ApiProperty({ description: "error message", default: "additional info" })
	message: string;

	@ApiProperty({ description: "error text", default: "Unauthorized" })
	error: string;

	@ApiProperty({ description: "status code", default: 401 })
	statusCode: number;
}

export class BadRequestResponseDto {
	@ApiProperty({ description: "validation errors list" })
	message: string[];

	@ApiProperty({ description: "error text", default: "Bad Request" })
	error: string;

	@ApiProperty({ description: "status code", default: 400 })
	statusCode: number;
}

export class ConflictErrorResponse {
	@ApiProperty({ default: "reason for conflict happened at resource" })
	message: string;

	@ApiProperty({ description: "error text", default: "Conflict" })
	error: string;

	@ApiProperty({ description: "status code", default: 409 })
	statusCode: number;
}
