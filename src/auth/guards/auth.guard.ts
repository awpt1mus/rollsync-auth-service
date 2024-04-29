import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserRepository } from "src/database/repositories/user.repository";
import {
	ApplicationErrorCodes,
	ApplicationException,
} from "src/root/dtos/application.exception";
import { TokenService } from "../services/jwt.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly tokenService: TokenService,
		private readonly userRepository: UserRepository,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const [type, token] = request.headers.authorization?.split(" ") ?? [];

		if (!(type === "Bearer" && token)) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_INVALID_ACCESS_TOKEN,
				401,
			);
		}

		const { payload, success } =
			await this.tokenService.validateAccessToken(token);

		if (!success) {
			throw new ApplicationException(
				ApplicationErrorCodes.AUTH_ACCESS_TOKEN_EXPIRED,
				401,
			);
		}

		const { id } = payload;

		try {
			const user = await this.userRepository.findById(id);

			if (!user) {
				throw new ApplicationException(
					ApplicationErrorCodes.AUTH_USER_NOT_FOUND,
					404,
				);
			}
			request.user = user;
		} catch (error) {
			throw new ApplicationException(
				ApplicationErrorCodes.INTERNAL_SERVER_ERROR,
				500,
			);
		}

		return true;
	}
}
