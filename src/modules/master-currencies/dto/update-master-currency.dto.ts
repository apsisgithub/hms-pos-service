import { PartialType } from '@nestjs/swagger';
import { CreateMasterCurrencyDto } from './create-master-currency.dto';

export class UpdateMasterCurrencyDto extends PartialType(CreateMasterCurrencyDto) {}
