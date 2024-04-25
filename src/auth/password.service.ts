import { Injectable } from "@nestjs/common";
import { argon2id, hash, verify } from "argon2";

@Injectable()
export class PasswordService {
	async hash(passwordText: string) {
		const hashed = await hash(passwordText, {
			type: argon2id,
		});
		return hashed;
	}

	async isCorrect(passwordHash: string, passwordText: string) {
		try {
			const isMatch = await verify(passwordHash, passwordText);
			return isMatch;
		} catch (error) {
			return false;
		}
	}
}
