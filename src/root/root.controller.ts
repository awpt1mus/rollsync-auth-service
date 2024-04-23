import { Controller, Get } from "@nestjs/common";

@Controller()
export class RootController {
  @Get("/ping")
  ping() {
    return {
      status: "ok",
      env: process.env.NODE_ENV === "production" ? "prod" : "dev",
    };
  }
}
