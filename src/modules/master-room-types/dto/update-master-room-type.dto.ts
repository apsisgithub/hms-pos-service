import { PartialType } from '@nestjs/swagger';
import { CreateMasterRoomTypeDto } from './create-master-room-type.dto';

export class UpdateMasterRoomTypeDto extends PartialType(CreateMasterRoomTypeDto) {}
