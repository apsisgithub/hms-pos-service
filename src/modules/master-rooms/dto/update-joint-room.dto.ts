import { PartialType } from "@nestjs/swagger";
import { CreateJointRoomDto } from "./create-joint-room.dto";

export class UpdateJointRoomDto extends PartialType(CreateJointRoomDto) {}
