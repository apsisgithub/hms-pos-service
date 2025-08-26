import { PartialType } from '@nestjs/swagger';
import { CreateMasterRoomRateDto } from './create-master-room-rate.dto';

export class UpdateMasterRoomRateDto extends PartialType(CreateMasterRoomRateDto) {}
