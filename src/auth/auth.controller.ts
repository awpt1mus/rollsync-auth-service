import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from "@nestjs/common";
import { LoginRequestSchema, SignUpRequestSchema } from "./auth.dtos";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async handleTraditionalLogin(@Body() body: unknown) {
    const loginBodyParserResult = await LoginRequestSchema.safeParseAsync(body);

    if (!loginBodyParserResult.success) {
      throw new BadRequestException(loginBodyParserResult.error.issues);
    }

    const loginRequestDto = loginBodyParserResult.data;

    const result = await this.authService.verifyLogin(loginRequestDto);
    return result;
  }

  @Post("/register")
  async handleTraditionalSignUp(@Body() body: unknown) {
    const signupBodyParseResult = await SignUpRequestSchema.safeParseAsync(
      body
    );

    if (!signupBodyParseResult.success) {
      throw new BadRequestException(signupBodyParseResult.error.issues);
    }

    const signUpRequestDto = signupBodyParseResult.data;

    const result = await this.authService.registerUser(signUpRequestDto);

    if (!result) {
      throw new InternalServerErrorException("unable to register user");
    }

    return { message: "ok" };
  }
}
