import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { JwtPayloadInterface } from "src/common/types/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>("JWT_SECRET"),
        });
    }

    async validate(payload: any): Promise<JwtPayloadInterface> {
        console.log("thePayload--> ", payload);
        return {
            user_id: payload.id,
            user_name: payload.name,
            user_role: payload.role,
            user_phone: payload.phone,
            user_email: payload.email,
            user_role_id: payload.role_id,
        };
    }
}
