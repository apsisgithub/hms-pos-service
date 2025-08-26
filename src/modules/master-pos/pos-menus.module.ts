import { Module } from "@nestjs/common";
import { PosMenusService } from "./pos-menus.service";
import { PosMenusController } from "./pos-menus.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PosMenu } from "./entities/pos-menu.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PosMenu])],
    controllers: [PosMenusController],
    providers: [PosMenusService],
})
export class PosMenusModule {}