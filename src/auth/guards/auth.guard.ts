import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { UserRepository } from "src/database/repositories/user.repository";
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
			throw new UnauthorizedException();
		}

		const { payload, success } =
			await this.tokenService.validateAccessToken(token);

		if (!success) {
			throw new UnauthorizedException();
		}

		const { id } = payload;

		request.user = await this.userRepository.findById(id);

		return true;
	}
}
