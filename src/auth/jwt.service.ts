import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import { AppConfig } from "src/config/config.types";
import { TokenPayload, TokenValidationResult } from "./auth.dtos";

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  newToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      const secret = this.configService.get<string>("jwtSecret");

      jwt.sign(
        payload,
        secret,
        {
          expiresIn: "1h",
          issuer: "rollsync-auth",
        },
        (err, encoded) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(encoded);
        }
      );
    });
  }

  validateToken(token: string): Promise<TokenValidationResult> {
    return new Promise((resolve, reject) => {
      const secret = this.configService.get<string>("jwtSecret");

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
}
