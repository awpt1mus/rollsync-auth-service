import {
	Body,
	Controller,
	HttpCode,
	InternalServerErrorException,
	Post,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import {
	BadRequestResponseDto,
	ConflictErrorResponse,
	UnAuthorizedResponseDto,
} from "src/root/dtos/error.response.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { LoginSuccessDto } from "./dtos/login.success.dto";
import { RegisterDto } from "./dtos/register.dto";
@Controller("auth")
@ApiTags("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/login")
	@ApiResponse({
		status: 401,
		description: "authentication failed",
		type: UnAuthorizedResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: "invalid email or password etc",
		type: BadRequestResponseDto,
	})
	@ApiResponse({
		status: 200,
		description: "login success",
		type: LoginSuccessDto,
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
		type: BadRequestResponseDto,
	})
	@ApiResponse({
		status: 201,
		description: "successfully signed up",
	})
	@ApiResponse({
		status: 409,
		description: "Conflict",
		type: ConflictErrorResponse,
	})
	async handleTraditionalSignUp(@Body() body: RegisterDto) {
		const result = await this.authService.registerUser(body);

		if (!result) {
			throw new InternalServerErrorException("unable to register user");
		}

		return;
	}
}
