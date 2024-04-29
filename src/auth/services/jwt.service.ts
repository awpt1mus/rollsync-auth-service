import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import { AppConfig } from "src/config/config.types";
import { TokenPayload, TokenValidationResult } from "../dtos/token.dtos";

@Injectable()
export class TokenService {
	constructor(private readonly configService: ConfigService<AppConfig>) {}

	private async generateNewToken(
		payload: TokenPayload,
		secret: string,
		expiry: string,
	): Promise<string> {
		return new Promise((resolve, reject) => {
			jwt.sign(
				payload,
				secret,
				{
					expiresIn: expiry,
					issuer: "rollsync-auth",
				},
				(err, encoded) => {
					if (err) {
						reject(err);
						return;
					}

					resolve(encoded);
				},
			);
		});
	}

	private async verifyToken(
		token: string,
		secret: string,
	): Promise<TokenValidationResult> {
		return new Promise((resolve, reject) => {
			jwt.verify(token, secret, { issuer: "rollsync-auth" }, (err, decoded) => {
				if (err) {
					resolve({ success: false, payload: null });
					return;
				}

				if (typeof decoded === "string") {
					resolve({ success: false, payload: null });
					return;
				}

				if ("id" in decoded && "email" in decoded) {
					resolve({ success: true, payload: decoded as TokenPayload });
					return;
				}

				resolve({ success: false, payload: null });
				return;
			});
		});
	}

	newAccessToken(payload: TokenPayload): Promise<string> {
		return this.generateNewToken(
			payload,
			this.configService.get<string>("accessTokenSecret"),
			"15m",
		);
	}

	validateAccessToken(token: string): Promise<TokenValidationResult> {
		return this.verifyToken(
			token,
			this.configService.get<string>("accessTokenSecret"),
		);
	}

	newRefreshToken(payload: TokenPayload): Promise<string> {
		return this.generateNewToken(
			payload,
			this.configService.get<string>("refreshTokenSecret"),
			"30d",
		);
	}

	validateRefreshToken(token: string) {
		return this.verifyToken(
			token,
			this.configService.get<string>("refreshTokenSecret"),
		);
	}
}
