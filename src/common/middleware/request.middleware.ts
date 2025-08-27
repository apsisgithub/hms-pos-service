import { Injectable, NestMiddleware } from "@nestjs/common";
import { setRequest } from "../utils/user.util";

@Injectable()
export class RequestMiddleware implements NestMiddleware {
    use(req: any, res: any, next: (error?: any) => void) {
        setRequest(req);
        next();
    }
}
