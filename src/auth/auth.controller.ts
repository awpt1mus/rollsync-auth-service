import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	UseFilters,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserEntity } from "src/database/dtos/custom.types";
import {
	ApplicationErrorCodes,
	ApplicationException,
} from "src/root/dtos/application.exception";
import { ApplicationErrorResponse } from "src/root/dtos/error.response.dto";
import { GlobalExceptionFilter } from "src/root/global.exception.filter";
import { RequestUser } from "./decorators/request.user.decorator";
import { LoginDto } from "./dtos/login.dto";
import { LoginSuccessDto } from "./dtos/login.success.dto";
import { RegisterDto } from "./dtos/register.dto";
import {
	RefreshTokenRequestDto,
	RefreshTokenRequestSuccessDto,
} from "./dtos/token.dtos";
import { UserInfoDto } from "./dtos/user.info.dto";
import { AuthGuard } from "./guards/auth.guard";
import { AuthService } from "./services/auth.service";
@Controller("auth")
@ApiTags("auth")
@UseFilters(GlobalExceptionFilter)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/login")
	@ApiResponse({
		status: 401,
		description: "authentication failed",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 400,
		description: "invalid email or password etc",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 200,
		description: "login success",
		type: LoginSuccessDto,
	})
	@ApiResponse({
		status: 500,
		description: "something went wrong on server",
		type: ApplicationErrorResponse,
	})
	@HttpCode(200)
	async handleTraditionalLogin(@Body() body: LoginDto) {
		const result = await this.authService.verifyLogin(body);
		return result;
	}

	@Post("/register")
	@ApiResponse({
		status: 400,
		description: "invalid request body provided",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 201,
		description: "successfully signed up",
	})
	@ApiResponse({
		status: 409,
		description: "Conflict",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 500,
		description: "something went wrong on server",
		type: ApplicationErrorResponse,
	})
	async handleTraditionalSignUp(@Body() body: RegisterDto) {
		const result = await this.authService.registerUser(body);

		if (!result) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_SIGNUP_FAILED,
				500,
			);
		}
	}

	@Get("/me")
	@ApiBearerAuth("jwt-auth")
	@UseGuards(AuthGuard)
	@ApiResponse({
		status: 401,
		description: "token expired or invalid",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 200,
		description: "get user info",
		type: UserInfoDto,
	})
	@ApiResponse({
		status: 404,
		description: "user not found / no longer exists",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 500,
		description: "something went wrong on server",
		type: ApplicationErrorResponse,
	})
	async getUserInfo(@RequestUser() user: UserEntity): Promise<UserInfoDto> {
		return {
			id: user.id,
			avatar_url: user.avatar_url,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
		};
	}

	@Post("/refresh")
	@ApiResponse({
		status: 400,
		description: "invalid request body provided",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 401,
		description: "refresh token expired or invalid",
		type: ApplicationErrorResponse,
	})
	@ApiResponse({
		status: 200,
		description: "successfully get new access token",
		type: RefreshTokenRequestSuccessDto,
	})
	@ApiResponse({
		status: 500,
		description: "something went wrong on server",
		type: ApplicationErrorResponse,
	})
	@HttpCode(200)
	async getNewAccessToken(@Body() body: RefreshTokenRequestDto) {
		return this.authService.getNewAccessToken(body.refresh_token);
	}
}
