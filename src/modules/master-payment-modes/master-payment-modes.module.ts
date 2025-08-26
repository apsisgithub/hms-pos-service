import { Module } from "@nestjs/common";
import { MasterPaymentModesService } from "./master-payment-modes.service";
import { MasterPaymentModesController } from "./master-payment-modes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterPaymentMode } from "./entities/master_payment_modes.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterPaymentMode])],
    controllers: [MasterPaymentModesController],
    providers: [MasterPaymentModesService],
})
export class MasterPaymentModesModule {}
