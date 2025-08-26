import { Module } from "@nestjs/common";
import { MasterExtraChargesService } from "./master-extra-charges.service";
import { MasterExtraChargesController } from "./master-extra-charges.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterExtraCharge } from "./entities/master-extra-charge.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterExtraCharge])],
    controllers: [MasterExtraChargesController],
    providers: [MasterExtraChargesService],
})
export class MasterExtraChargesModule {}
