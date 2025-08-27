// interceptors/custom-response.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class CustomResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const method = req.method;

        return next.handle().pipe(
            map((response) => {
                let status = 200;
                if (method === "POST") status = 201;
                else if (method === "DELETE") status = 200;

                const base = {
                    status,
                    success: true,
                    message: "Success",
                };

                if (
                    response &&
                    typeof response === "object" &&
                    "data" in response
                ) {
                    return {
                        ...base,
                        data: response.data,
                        ...(response.pagination && {
                            pagination: response.pagination,
                        }),
                    };
                }

                return {
                    ...base,
                    data: response,
                };
            })
        );
    }
}
