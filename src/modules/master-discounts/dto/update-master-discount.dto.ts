import { PartialType } from '@nestjs/swagger';
import { CreateMasterDiscountDto } from './create-master-discount.dto';

export class UpdateMasterDiscountDto extends PartialType(CreateMasterDiscountDto) {}
