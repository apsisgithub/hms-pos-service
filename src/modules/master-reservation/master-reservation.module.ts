import { Module } from "@nestjs/common";
import { MasterReservationService } from "./master-reservation.service";
import { MasterReservationController } from "./master-reservation.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reservation } from "./entities/master_reservation.entity";
import { ReservationRoom } from "./entities/master_reservation_room.entity";
import { MasterReservationGuests } from "./entities/master_reservation_guests.entity";
import { MasterGuest } from "src/modules/master-guests/entities/master-guest.entity";
import { MasterRoomsModule } from "../master-rooms/master-rooms.module";
import { AuditLogModule } from "../audit-log/audit-log.module";
import { ReservationSourceInfo } from "./entities/master_reservation_source_info.entity";
import { MasterCreditCard } from "./entities/master_credit_card.entity";
import { MasterCharges } from "./entities/master_charges.entity";
import { MasterPayments } from "./entities/master_payments.entity";
import { MasterFolios } from "./entities/master_folios.entity";
import { MasterUser } from "../master-users/entities/master_user.entity";
import { MasterFolioDiscount } from "./entities/master_folio_discount.entity";
import { MasterTaxesModule } from "../master-taxes/master-taxes.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Reservation,
            ReservationRoom,
            MasterReservationGuests,
            MasterGuest,
            ReservationSourceInfo,
            MasterCreditCard,
            MasterCharges,
            MasterPayments,
            MasterFolios,
            MasterUser,
            MasterFolioDiscount,
        ]),
        MasterRoomsModule,
        AuditLogModule,
        MasterTaxesModule
    ],
    controllers: [MasterReservationController],
    providers: [MasterReservationService],
})
export class MasterReservationModule {}
