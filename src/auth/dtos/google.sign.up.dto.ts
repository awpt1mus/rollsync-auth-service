import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
} from "class-validator";

export class GoogleSignUpDto {
	@ApiProperty({
		title: "Google ID token",
		description:
			"server uses id token to verify user's identity with google server",
	})
	@IsNotEmpty({ message: "id token cannot be empty" })
	id_token: string;

	@IsOptional()
	@IsNotEmpty({ message: "firstname cannot be empty" })
	@MaxLength(200, { message: "firstname cannot be longer than 200 characters" })
	@Matches(/^[a-zA-Z]+$/, {
		message: "firstname can only contain letters(a-z)",
	})
	@ApiPropertyOptional({
		description: "your first name, can only contain letters(a-z / A-Z)",
	})
	firstname: string;

	@IsOptional()
	@IsString({ message: "lastname must be a string" })
	@MaxLength(200, { message: "lastname cannot be longer than 200 characters" })
	@Matches(/^[a-zA-Z]+$/, { message: "lastname can only contain letters(a-z)" })
	@ApiPropertyOptional({
		description:
			"your last name / family name, if provided then must contain only letters(a-z / A-Z)",
	})
	lastname: string;

	@IsOptional()
	@IsString({ message: "username must be a string" })
	@MaxLength(20, { message: "username cannot be longer than 20 characters" })
	@Matches(/^[a-zA-Z0-9_]+$/, {
		message:
			"username can only contain letters(a-z), numbers(0-9) and underscores(_)",
	})
	@ApiPropertyOptional({
		description:
			"a username / nickname, if provided then must contain only letters (a-z / A-Z), digits(0-9), underscores(_)",
	})
	username: string;
}
