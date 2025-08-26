import { PartialType } from '@nestjs/swagger';
import { CreateMasterPaymentModeDto } from './create-master-payment-mode.dto';

export class UpdateMasterPaymentModeDto extends PartialType(CreateMasterPaymentModeDto) {}
