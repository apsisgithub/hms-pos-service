// src/entities/reservation_room.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Reservation } from "./master_reservation.entity";
import { MasterRoom } from "src/entities/master/master_room.entity";
import { MasterRoomType } from "src/entities/master/master_room_types.entity";
import { MasterRateType } from "src/entities/master/master_rate_type.entity";
import { CoreEntity } from "src/utils/core-entity";
import { MasterFolios } from "./master_folios.entity";

@Entity("reservation_rooms")
export class ReservationRoom extends CoreEntity {
  @ManyToOne(() => Reservation, (reservation) => reservation.reservationRooms)
  @JoinColumn({ name: "reservation_id" })
  reservation: Reservation;

  @Column({ type: "int", nullable: false })
  reservation_id: number;

  @Column({ type: "int", nullable: false })
  room_id: number;

  @Column({ type: "int", nullable: false })
  room_type_id: number;

  @Column({ type: "int", nullable: false })
  rate_type_id: number;

  @Column({ type: "int", nullable: false })
  folio_id: number;

  @Column({ type: "int", default: 0, nullable: false })
  adults_in_room: number;

  @Column({ type: "int", default: 0, nullable: false })
  children_in_room: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0.0,
    nullable: false,
  })
  room_rate: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  discount_applied: number;

  @Column({ type: "boolean", default: false, nullable: false })
  is_assigned: boolean;

  // ManyToOne relationship with MasterRoom
  @ManyToOne(() => MasterRoom, (room) => room.reservationRooms)
  @JoinColumn({ name: "room_id" })
  room: MasterRoom;

  @ManyToOne(() => MasterRoomType, (roomType) => roomType.reservationRooms)
  @JoinColumn({ name: "room_type_id" })
  roomType: MasterRoomType;

  @ManyToOne(() => MasterRateType, (rateType) => rateType.reservationRooms)
  @JoinColumn({ name: "rate_type_id" })
  rateType: MasterRateType;

  @ManyToOne(() => MasterFolios, (folio) => folio.reservationRooms)
  @JoinColumn({ name: "folio_id" })
  folio: MasterFolios;
}
