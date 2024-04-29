import { HttpException } from "@nestjs/common";

export const ApplicationErrorCodes = {
	INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
	AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
	AUTH_BAD_REQUEST: "AUTH_BAD_REQUEST",
	AUTH_EMAIL_EXISTS: "AUTH_EMAIL_EXISTS",
	AUTH_USERNAME_EXISTS: "AUTH_USERNAME_EXISTS",
	AUTH_ACCESS_TOKEN_EXPIRED: "AUTH_ACCESS_TOKEN_EXPIRED",
	AUTH_REFRESH_TOKEN_EXPIRED: "AUTH_REFRESH_TOKEN_EXPIRED",
	AUTH_ACCOUNT_LOCKED: "AUTH_ACCOUNT_LOCKED",
	AUTH_SIGNUP_FAILED: "AUTH_SIGNUP_FAILED",
	AUTH_INVALID_ACCESS_TOKEN: "AUTH_INVALID_ACCESS_TOKEN",
	AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",
	AUTH_REFRESH_TOKEN_REVOKED: "AUTH_REFRESH_TOKEN_REVOKED",
} as const;

export class ApplicationException extends HttpException {
	public erroCode: string;

	constructor(
		errorCode: string,
		statusCode: number,
		message?: string | string[],
	) {
		super(message, statusCode);
		this.erroCode = errorCode;
	}
}
