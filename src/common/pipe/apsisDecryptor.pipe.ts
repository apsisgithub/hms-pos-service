import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from "@nestjs/common";
import { apsisDecrypt } from "../utils/apsis-crypto.util";

interface DecryptPipeOptions {
  key: string;
  type?: "string" | "number";
}

@Injectable()
export class DecryptPipe implements PipeTransform {
  constructor(private readonly options: DecryptPipeOptions) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { key, type = "number" } = this.options;

    if (!value) {
      throw new BadRequestException(`Missing parameter '${key}'`);
    }

    try {
      const decrypted = apsisDecrypt(value);

      if (type === "number") {
        const numeric = Number(decrypted);
        if (isNaN(numeric)) {
          throw new BadRequestException(`Invalid encrypted parameter: ${key}`);
        }
        return numeric;
      }

      return decrypted;
    } catch (error) {
      throw new BadRequestException(`Failed to decrypt parameter '${key}'`);
    }
  }
}
