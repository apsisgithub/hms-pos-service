import { Module } from "@nestjs/common";
import { MasterGuestsService } from "./master-guests.service";
import { MasterGuestsController } from "./master-guests.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterGuest } from "./entities/master-guest.entity";
import { ReservationRoom } from "../master-reservation/entities/master_reservation_room.entity";
import { MasterReservationGuests } from "../master-reservation/entities/master_reservation_guests.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MasterGuest,
            ReservationRoom,
            MasterReservationGuests,
        ]),
    ],
    controllers: [MasterGuestsController],
    providers: [MasterGuestsService],
})
export class MasterGuestsModule {}
