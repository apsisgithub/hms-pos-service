import { Module } from "@nestjs/common";
import { PosOutletsService } from "./pos-outlets.service";
import { PosOutletsController } from "./pos-outlets.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PosOutlet } from "./entities/pos-outlet.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PosOutlet])],
    controllers: [PosOutletsController],
    providers: [PosOutletsService],
})
export class PosOutletsModule {}