import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { apsisDecrypt } from "../utils/apsis-crypto.util"; // your helper

interface DecryptParamOptions {
  key: string;
  type?: "string" | "number";
}

export const DecryptParam = createParamDecorator(
  (data: DecryptParamOptions, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { key, type = "number" } = data;
    const param = request.params[key];

    if (!param) {
      throw new BadRequestException(`Missing parameter '${key}'`);
    }

    try {
      const decrypted = apsisDecrypt(param);

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
);
