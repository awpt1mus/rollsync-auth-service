import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ApplicationErrorResponse {
	@ApiProperty({ description: "application error code", type: String })
	error: string;

	@ApiProperty({ description: "http status code", type: Number })
	statusCode: number;

	@ApiPropertyOptional({ description: "error details", type: [String] })
	message: string | object;
}
