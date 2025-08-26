import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Response } from "express"; // ✅ Fix: add this line

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal server error";

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const res = exception.getResponse();

            if (typeof res === "string") {
                message = res;
            } else if (typeof res === "object" && res !== null) {
                message =
                    (res as any).message || (res as any).error || "Failed";
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        response.status(status).json({
            status,
            success: false,
            message,
        });
    }
}
