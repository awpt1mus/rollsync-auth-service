import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserInfoDto {
	@ApiProperty({ description: "user id", default: "<UUID>" })
	id: string;

	@ApiProperty({ description: "first name" })
	firstname: string;

	@ApiPropertyOptional({ description: "lastname / family name" })
	lastname: string;

	@ApiPropertyOptional({ description: "username / nickname" })
	username: string;

	@ApiPropertyOptional({ description: "profile picture url" })
	avatar_url: string | null;

	@ApiProperty({ description: "email address" })
	email: string;
}
