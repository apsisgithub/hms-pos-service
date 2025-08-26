import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { CoreEntity } from "src/utils/core-entity";
import { Reservation } from "./master_reservation.entity";
import { MasterSbu } from "src/modules/master-sbu/entities/master_sbu.entity";
import { MasterGuest } from "src/modules/master-guests/entities/master-guest.entity";
import { MasterCharges } from "./master_charges.entity";
import { MasterPayments } from "./master_payments.entity";
import { MasterFolioDiscount } from "./master_folio_discount.entity";
import { MasterRoom } from "src/modules/master-rooms/entities/master_room.entity";
import { FoliosRoomsMapping } from "./folios_rooms_mapping.entity";
import { ReservationRoom } from "./master_reservation_room.entity";

export enum FolioType {
    GUEST = "Guest",
    COMPANY = "Company",
    GROUP_OWNER = "Group Owner",
}

export enum FolioStatus {
    OPEN = "Open",
    CLOSED = "Closed",
    CUT = "Cut",
}

@Entity("master_folios")
export class MasterFolios extends CoreEntity {
    @Column({ type: "varchar", length: 50, nullable: false, unique: true })
    folio_no: string;

    @Column({ type: "int", nullable: false })
    guest_id: number;

    @Column({ type: "int", nullable: false })
    sbu_id: number;

    @Column({
        type: "enum",
        enum: FolioStatus,
        nullable: false,
        default: FolioStatus.OPEN,
    })
    status: FolioStatus;

    @Column({
        type: "enum",
        enum: FolioType,
        nullable: false,
        default: FolioType.GUEST,
    })
    folio_type: FolioType;

    @Column({ type: "int", nullable: false })
    reservation_id: number;

    // Relationships

    @ManyToOne(() => MasterGuest, (guest) => guest.folios)
    @JoinColumn({ name: "guest_id" })
    guest: MasterGuest;

    @ManyToOne(() => MasterSbu, (sbu) => sbu.folios)
    @JoinColumn({ name: "sbu_id" })
    sbu: MasterSbu;

    @ManyToOne(() => Reservation, (reservation) => reservation.folios)
    @JoinColumn({ name: "reservation_id" })
    reservation: Reservation;

    @OneToMany(() => MasterCharges, (charge) => charge.folio)
    charges: MasterCharges[];

    @OneToMany(() => MasterPayments, (payment) => payment.folio)
    payments: MasterPayments[];

    @OneToMany(() => MasterFolioDiscount, (discount) => discount.folio)
    discounts: MasterFolioDiscount[];

    @OneToMany(() => FoliosRoomsMapping, (mapping) => mapping.folio)
    foliosRoomsMappings: FoliosRoomsMapping[];

    @OneToMany(
        () => ReservationRoom,
        (reservationRoom) => reservationRoom.folio
    )
    reservationRooms: ReservationRoom[];
}
