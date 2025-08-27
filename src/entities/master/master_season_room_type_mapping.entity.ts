import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { MasterSeason } from "./master_seasons.entity";
import { MasterRoomType } from "src/entities/master/master_room_types.entity";
import { CoreEntity } from "src/utils/core-entity";

@Entity("master_season_room_type_mapping")
export class SeasonRoomTypeMapping extends CoreEntity {
  @PrimaryColumn({ type: "int" })
  season_id: number;

  @PrimaryColumn({ type: "int" })
  room_type_id: number;

  @ManyToOne(() => MasterSeason, (season) => season.seasonRoomTypeMappings, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "season_id" })
  season: MasterSeason;

  @ManyToOne(() => MasterRoomType, (roomType) => roomType.seasonMappings, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "room_type_id" })
  roomType: MasterRoomType;
}
