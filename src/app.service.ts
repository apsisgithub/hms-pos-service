import { Injectable } from "@nestjs/common";
import { getCurrentUser } from "./common/utils/user.util";

@Injectable()
export class AppService {
    getHello() {
        return getCurrentUser("user_role");
    }
}
