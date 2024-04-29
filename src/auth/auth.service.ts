import { HttpStatus, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { UserRepository } from "src/database/repositories/user.repository";
import {
	ApplicationErrorCodes,
	ApplicationException,
} from "src/root/dtos/application.exception";
import { LoginDto } from "./dtos/login.dto";
import { LoginSuccessDto } from "./dtos/login.success.dto";
import { RegisterDto } from "./dtos/register.dto";
import { TokenService } from "./jwt.service";
import { PasswordService } from "./password.service";

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly passwordService: PasswordService,
		private readonly tokenService: TokenService,
	) {}

	async registerUser(dto: RegisterDto) {
		const existingUser = await this.userRepository.findByEmail(
			dto.email.toLocaleLowerCase(),
		);

		if (existingUser) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_EMAIL_EXISTS,
				409,
			);
		}

		dto.password = await this.passwordService.hash(dto.password);
		dto.email = dto.email.toLowerCase();

		try {
			const result = await this.userRepository.insertUser(dto);
			return result.id;
		} catch (error: unknown) {
			const isObject = typeof error === "object";

			if (isObject && "code" in error) {
				switch (error.code) {
					case "23505":
						throw new ApplicationException(
							ApplicationErrorCodes.AUTH_USERNAME_EXISTS,
							HttpStatus.CONFLICT,
						);
					default:
						throw new ApplicationException(
							ApplicationErrorCodes.INTERNAL_SERVER_ERROR,
							HttpStatus.INTERNAL_SERVER_ERROR,
						);
				}
			}

			throw new ApplicationException(
				ApplicationErrorCodes.INTERNAL_SERVER_ERROR,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async verifyLogin(dto: LoginDto): Promise<LoginSuccessDto> {
		const { email, password } = dto;

		const existingUser = await this.userRepository.findByEmail(
			email.toLocaleLowerCase(),
		);

		if (!existingUser) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_INVALID_CREDENTIALS,
				401,
			);
		}

		if (existingUser.attempts === 3) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_ACCOUNT_LOCKED,
				401,
			);
		}

		const isPasswordMatching = await this.passwordService.isCorrect(
			existingUser.password,
			password,
		);

		if (!isPasswordMatching) {
			const attempts = Math.min(3, existingUser.attempts + 1);

			await this.userRepository.updateAttempts(existingUser.id, attempts);

			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_INVALID_CREDENTIALS,
				401,
			);
		}

		const { id, firstname, lastname, username, avatar_url } = existingUser;

		const accessToken = await this.tokenService.newToken({
			id,
			email: email.toLocaleLowerCase(),
		});

		return plainToInstance(LoginSuccessDto, {
			access_token: accessToken,
			id,
			firstname,
			lastname,
			username,
			avatar_url,
			email: email.toLocaleLowerCase(),
		});
	}
}
