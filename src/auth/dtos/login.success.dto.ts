import { ApiProperty } from "@nestjs/swagger";

export class LoginSuccessDto {
	@ApiProperty({
		description:
			"access token, should be included in Authorization header for protected routes",
	})
	access_token: string;

	@ApiProperty({
		description:
			"refresh token, should be included in Authorization header when aquiring new access token",
	})
	refresh_token: string;

	@ApiProperty({ description: "user id", default: "<UUID>" })
	id: string;

	@ApiProperty({ description: "first name" })
	firstname: string;

	@ApiProperty({ description: "lastname / family name" })
	lastname: string;

	@ApiProperty({ description: "username / nickname" })
	username: string;

	@ApiProperty({ description: "profile picture url" })
	avatar_url: string | null;

	@ApiProperty({ description: "email address" })
	email: string;
}
