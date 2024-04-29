import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import {
	ApplicationErrorCodes,
	ApplicationException,
} from "./dtos/application.exception";
import { ApplicationErrorResponse } from "./dtos/error.response.dto";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionFilter.name);

	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	private handleApplicationException(
		ex: ApplicationException,
	): ApplicationErrorResponse {
		const response = new ApplicationErrorResponse();
		response.statusCode =
			ex instanceof HttpException
				? ex.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;
		response.error = ex.erroCode;
		response.message =
			ex instanceof HttpException ? ex.getResponse() : undefined;
		return response;
	}

	private handleHttpException(ex: HttpException) {
		const response = new ApplicationErrorResponse();
		const frameworkRes = ex.getResponse();

		response.statusCode = ex.getStatus();
		response.error = ex.name;
		response.message =
			typeof frameworkRes === "object" ? frameworkRes["message"] : frameworkRes;
		return response;
	}

	private handleUnknownException(): ApplicationErrorResponse {
		const response = new ApplicationErrorResponse();
		response.error = ApplicationErrorCodes.INTERNAL_SERVER_ERROR;
		response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
		response.message = "Something went wrong";
		return response;
	}

	catch(exception: unknown, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();

		this.logger.error(exception);

		const isApplicationException = exception instanceof ApplicationException;
		const isHttpException = exception instanceof HttpException;

		let responseBody: ApplicationErrorResponse;

		if (isApplicationException) {
			responseBody = this.handleApplicationException(exception);
		} else if (isHttpException) {
			responseBody = this.handleHttpException(exception);
		} else {
			responseBody = this.handleUnknownException();
		}

		httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
	}
}
