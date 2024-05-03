import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from "@nestjs/common";

@Injectable()
export class DeviceValidationPipe implements PipeTransform {
	transform(value: unknown, metadata: ArgumentMetadata) {
		if (typeof value !== "string") {
			throw new BadRequestException("device must be a valid string");
		}

		if (!["android", "ios"].includes(value)) {
			throw new BadRequestException("device must be a valid string");
		}

		return value;
	}
}
