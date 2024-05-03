import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GoogleSignInDto {
	@ApiProperty({
		title: "Google ID token",
		description:
			"server uses id token to verify user's identity with google server",
	})
	@IsNotEmpty({ message: "id token cannot be empty" })
	id_token: string;
}
