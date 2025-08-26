import { PartialType } from '@nestjs/swagger';
import { CreateMasterExtraChargeDto } from './create-master-extra-charge.dto';

export class UpdateMasterExtraChargeDto extends PartialType(CreateMasterExtraChargeDto) {}
