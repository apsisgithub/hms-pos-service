import { PartialType } from '@nestjs/swagger';
import { CreatePosOutletDto } from './create-pos-outlet.dto';

export class UpdatePosOutletDto extends PartialType(CreatePosOutletDto) {}