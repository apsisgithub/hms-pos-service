import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Health")
@Controller("health")
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  findAll() {
    return { message: `Hello World` };
  }
}
