import { ApiProperty } from "@nestjs/swagger";

export class PingResponseDto {
	@ApiProperty({ description: "status text", default: "ok" })
	status: string;

	@ApiProperty({ description: "environment", default: "dev" })
	env: "prod" | "dev";
}
