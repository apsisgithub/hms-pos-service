import { PartialType } from '@nestjs/swagger';
import { CreateMasterTaxDto } from './create-master-tax.dto';

export class UpdateMasterTaxDto extends PartialType(CreateMasterTaxDto) {}
