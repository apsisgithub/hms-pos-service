import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
}
