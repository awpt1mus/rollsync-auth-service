import { ApiProperty } from "@nestjs/swagger";
import { UserInfoDto } from "./user.info.dto";

export class LoginSuccessDto extends UserInfoDto {
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
}
