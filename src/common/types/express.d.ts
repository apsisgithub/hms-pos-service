// src/types/express.d.ts
import { JwtPayloadInterface } from "./jwt-payload.interface";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayloadInterface;
        }
    }
}

export {};
