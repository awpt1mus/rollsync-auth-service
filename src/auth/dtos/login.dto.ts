import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
	@IsString({ message: "email must be a string" })
	@IsEmail({}, { message: "email must be a valid email address" })
	@ApiProperty({ description: "email address", default: "example@email.com" })
	email: string;

	@IsNotEmpty({ message: "password cannot be empty" })
	@IsString({ message: "password must be a string" })
	@MinLength(6, { message: "password must be atleast 6 characters long" })
	@ApiProperty({ description: "password must be atleast 6 characters long" })
	password: string;
}
