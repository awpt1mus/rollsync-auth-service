import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";

export class RegisterDto {
	@IsString({ message: "email must be a string" })
	@IsEmail({}, { message: "email must be a valid email address" })
	@ApiProperty({ description: "email address", default: "example@email.com" })
	email: string;

	@IsNotEmpty({ message: "password cannot be empty" })
	@IsString({ message: "password must be a string" })
	@MinLength(6, { message: "password must be atleast 6 characters long" })
	@ApiProperty({ description: "password must be atleast 6 characters long" })
	password: string;

	@IsNotEmpty({ message: "firstname cannot be empty" })
	@MaxLength(200, { message: "firstname cannot be longer than 200 characters" })
	@Matches(/^[a-zA-Z]+$/, {
		message: "firstname can only contain letters(a-z)",
	})
	@ApiProperty({
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
