import {
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    HttpException,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import {
    extractDuplicateFieldMessage,
    extractForeignKeyMessage,
} from "./extract-duplicate.error.util";

export function handleError(err: any, action = ""): never {
    if (err instanceof QueryFailedError) {
        const code = err.driverError?.code;
        const message = err.driverError?.message || "";

        if (code === "ER_DUP_ENTRY") {
            const msg = extractDuplicateFieldMessage(message);

            throw new BadRequestException(
                `Duplicate entry ${msg} ${action}`.trim()
            );
        }

        if (code === "ER_NO_REFERENCED_ROW_2") {
            const msg = extractForeignKeyMessage(message);
            throw new NotFoundException(` ${msg} ${action}`.trim());
        }
    }

    // If the error is already a known HttpException (e.g. BadRequestException, ForbiddenException, etc.)
    if (err instanceof HttpException) {
        throw err;
    }

    // Fallback to InternalServerError
    console.error("Unhandled error in handleError:", err);
    throw new InternalServerErrorException(
        `An error occurred ${action}`.trim()
    );
}
