import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as dayjs from "dayjs";
import { OAuth2Client } from "google-auth-library";
import { AppConfig, GoogleClientIdConfig } from "src/config/config.types";
import { UserEntity } from "src/database/dtos/custom.types";
import { RefreshTokenRepository } from "src/database/repositories/refresh.token.repository";
import { UserRepository } from "src/database/repositories/user.repository";
import {
	ApplicationErrorCodes,
	ApplicationException,
} from "src/root/dtos/application.exception";
import { GoogleSignUpDto } from "../dtos/google.sign.up.dto";
import { LoginDto } from "../dtos/login.dto";
import { LoginSuccessDto } from "../dtos/login.success.dto";
import { RegisterDto } from "../dtos/register.dto";
import {
	RefreshTokenRequestSuccessDto,
	TokenPayload,
} from "../dtos/token.dtos";
import { TokenService } from "./jwt.service";
import { PasswordService } from "./password.service";

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly configService: ConfigService<AppConfig>,
		private readonly userRepository: UserRepository,
		private readonly passwordService: PasswordService,
		private readonly tokenService: TokenService,
		private readonly refreshTokenRepository: RefreshTokenRepository,
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

			this.logger.error(error);

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

		return this.respondWithTokenPair(existingUser);
	}

	async getNewAccessToken(
		refreshToken: string,
	): Promise<RefreshTokenRequestSuccessDto> {
		const exists =
			await this.refreshTokenRepository.findTokenByValue(refreshToken);

		if (!exists) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_REFRESH_TOKEN_REVOKED,
				401,
			);
		}

		const tokenValidation =
			await this.tokenService.validateRefreshToken(refreshToken);

		if (!tokenValidation.success) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_REFRESH_TOKEN_EXPIRED,
				401,
			);
		}

		const { id, email } = tokenValidation.payload;

		const newAccessToken = await this.tokenService.newAccessToken({
			id,
			email,
		});

		return { access_token: newAccessToken };
	}

	private async verifyGoogleIdToken(
		idToken: string,
		device: "android" | "ios",
	) {
		const client = new OAuth2Client();
		const gclientConfig = this.configService.get<GoogleClientIdConfig>(
			"googleClientIdConfig",
		);
		const gdevliceClientId = gclientConfig[device];

		try {
			const ticket = await client.verifyIdToken({
				idToken,
				audience: gdevliceClientId,
			});

			const payload = ticket.getPayload();

			if (gdevliceClientId !== payload["aud"]) {
				throw new ApplicationException(
					ApplicationErrorCodes.AUTH_GOOGLE_ID_TOKEN_INVALID,
					401,
				);
			}
			return payload;
		} catch (error) {
			this.logger.error(error);
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_GOOGLE_ID_TOKEN_INVALID,
				401,
			);
		}
	}

	async validateGoogleSignIn(idToken: string, device: "android" | "ios") {
		const gtokenPayload = await this.verifyGoogleIdToken(idToken, device);

		this.logger.debug(`google user: ${JSON.stringify(gtokenPayload, null, 2)}`);

		const { email, sub } = gtokenPayload;

		const existingUser = await this.userRepository.findGoogleUser(email, sub);

		if (!existingUser) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_GOOGLE_USER_NOT_FOUND,
				404,
			);
		}

		return this.respondWithTokenPair(existingUser);
	}

	async validateGoogleSignUp(dto: GoogleSignUpDto, device: "android" | "ios") {
		const { id_token, firstname, lastname, username } = dto;
		const gtokenPayload = await this.verifyGoogleIdToken(id_token, device);

		this.logger.debug(`google user: ${JSON.stringify(gtokenPayload, null, 2)}`);

		const { sub, email, given_name, family_name, picture } = gtokenPayload;

		const existingUser = await this.userRepository.findByEmail(email);

		if (existingUser) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_EMAIL_EXISTS,
				409,
			);
		}

		const newUser = await this.userRepository.insertGoogleUser({
			email,
			googleId: sub,
			firstname: firstname || given_name,
			lastname: lastname || family_name,
			username,
			picture,
		});

		return this.respondWithTokenPair(newUser);
	}

	private async respondWithTokenPair(user: UserEntity) {
		const { id, email, firstname, lastname, username, avatar_url } = user;

		const tokenPayload: TokenPayload = {
			id,
			email: email.toLocaleLowerCase(),
		};

		const accessToken = await this.tokenService.newAccessToken(tokenPayload);
		const refreshToken = await this.tokenService.newRefreshToken(tokenPayload);

		await this.refreshTokenRepository.insertToken({
			value: refreshToken,
			expiry: dayjs().add(30, "day").toDate(),
		});

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
			id,
			firstname,
			lastname,
			username,
			avatar_url,
			email: email.toLocaleLowerCase(),
		};
	}
}
