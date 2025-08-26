import { PartialType } from '@nestjs/swagger';
import { CreateMasterTransportationModeDto } from './create-master-transportation-mode.dto';

export class UpdateMasterTransportationModeDto extends PartialType(CreateMasterTransportationModeDto) {}
