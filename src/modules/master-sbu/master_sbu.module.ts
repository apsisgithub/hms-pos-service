import { Module } from "@nestjs/common";
import { MasterSbuService } from "./master_sbu.service";
import { MasterSbuController } from "./master_sbu.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterSbu } from "./entities/master_sbu.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterSbu])],
    controllers: [MasterSbuController],
    providers: [MasterSbuService],
})
export class MasterSbuModule {}
