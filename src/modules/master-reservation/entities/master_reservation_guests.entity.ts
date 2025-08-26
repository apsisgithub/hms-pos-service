import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Reservation } from "./master_reservation.entity";
import { MasterGuest } from "src/modules/master-guests/entities/master-guest.entity";
import { CoreEntity } from "src/utils/core-entity";

@Entity("master_reservation_guests")
export class MasterReservationGuests extends CoreEntity {
    @Column({ type: "int", nullable: false })
    reservation_id: number;

    @Column({ type: "int", nullable: false })
    guest_id: number;

    @Column({ type: "boolean", nullable: false })
    is_master_guest: boolean;

    @Column({ type: "int", nullable: false })
    room_id: number;

    @ManyToOne(
        () => Reservation,
        (reservation) => reservation.reservationGuests
    )
    @JoinColumn({ name: "reservation_id" })
    reservation: Reservation;

    @ManyToOne(() => MasterGuest, (guest) => guest.reservationGuests)
    @JoinColumn({ name: "guest_id" })
    guest: MasterGuest;
}
