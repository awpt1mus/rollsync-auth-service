import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRepository } from "src/database/repositories/user.repository";
import {
  LoginRequestDTO,
  LoginSuccessDto,
  SignUpRequestDTO,
} from "./auth.dtos";
import { PasswordService } from "./password.service";
import { TokenService } from "./jwt.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService
  ) {}

  async registerUser(dto: SignUpRequestDTO) {
    const existingUser = await this.userRepository.findByEmail(
      dto.email.toLocaleLowerCase()
    );

    if (existingUser) {
      throw new ConflictException(`user with ${dto.email} already exists`);
    }

    dto.password = await this.passwordService.hash(dto.password);
    dto.email = dto.email.toLowerCase();

    const result = await this.userRepository.insertUser(dto);

    return result.id;
  }

  async verifyLogin(dto: LoginRequestDTO): Promise<LoginSuccessDto> {
    const { email, password } = dto;

    const existingUser = await this.userRepository.findByEmail(
      email.toLocaleLowerCase()
    );

    if (!existingUser) {
      throw new UnauthorizedException();
    }

    if (existingUser.attempts === 3) {
      throw new UnauthorizedException(
        "account is locked due to reaching limits of unsuccessful attempts"
      );
    }

    const isPasswordMatching = await this.passwordService.isCorrect(
      existingUser.password,
      password
    );

    if (!isPasswordMatching) {
      const attempts = Math.min(3, existingUser.attempts + 1);

      await this.userRepository.updateAttempts(existingUser.id, attempts);

      throw new UnauthorizedException();
    }

    const { id, firstname, lastname, username, avatar_url } = existingUser;

    const accessToken = await this.tokenService.newToken({
      id,
      email: email.toLocaleLowerCase(),
    });

    return {
      access_token: accessToken,
      id,
      firstname,
      lastname,
      username,
      avatar_url,
      email: email.toLocaleLowerCase(),
    };
  }
}
