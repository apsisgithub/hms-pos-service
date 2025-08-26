import { MasterRoom } from "src/entities/master/master_room.entity";
import { CoreEntity } from "src/utils/core-entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MasterFolios } from "./master/master_folios.entity";
import { Reservation } from "./master/master_reservation.entity";

@Entity("folios_rooms_mapping")
export class FoliosRoomsMapping extends CoreEntity {
  @Column({ type: "int", nullable: false })
  folio_id: number;

  @Column({ type: "int", nullable: false })
  room_id: number;

  @Column({ type: "int", nullable: false })
  reservation_id: number;

  @ManyToOne(() => MasterFolios, (folio) => folio.foliosRoomsMappings)
  @JoinColumn({ name: "folio_id" })
  folio: MasterFolios;

  @ManyToOne(() => MasterRoom, (room) => room.foliosRoomsMappings, {})
  @JoinColumn({ name: "room_id" })
  room: MasterRoom;

  @ManyToOne(() => Reservation, (reserv) => reserv.foliosRoomsMappings, {})
  @JoinColumn({ name: "reservation_id" })
  reservations: Reservation;
}
