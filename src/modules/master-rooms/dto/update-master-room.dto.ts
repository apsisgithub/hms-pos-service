import { PartialType } from "@nestjs/swagger";
import { CreateMasterRoomDto } from "./create-master-room.dto";

export class UpdateMasterRoomDto extends PartialType(CreateMasterRoomDto) {}
