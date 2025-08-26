import { Module } from "@nestjs/common";
import { MasterReservationBillingInfoService } from "./master-reservation-billing-info.service";
import { MasterReservationBillingInfoController } from "./master-reservation-billing-info.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReservationBillingDetails } from "./entities/master-reservation-billing-info.entity";
import { MasterEmailTemplate } from "../master-email-templates/entities/master_email_templates.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ReservationBillingDetails,
            MasterEmailTemplate,
        ]),
    ],
    controllers: [MasterReservationBillingInfoController],
    providers: [MasterReservationBillingInfoService],
})
export class MasterReservationBillingInfoModule {}
