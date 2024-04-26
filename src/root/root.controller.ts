import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { PingResponseDto } from "./dtos/ping.response.dto";

@Controller()
export class RootController {
	@Get("/ping")
	@ApiResponse({
		status: 200,
		description: "ping test / health check endpoint",
		type: PingResponseDto,
	})
	ping() {
		return {
			status: "ok",
			env: process.env.NODE_ENV === "production" ? "prod" : "dev",
		};
	}
}
