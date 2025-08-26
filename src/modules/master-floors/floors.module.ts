import { Module } from "@nestjs/common";
import { FloorsService } from "./floors.service";
import { FloorsController } from "./floors.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterFloor } from "./entities/master_floor.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterFloor])],
    controllers: [FloorsController],
    providers: [FloorsService],
})
export class FloorsModule {}
