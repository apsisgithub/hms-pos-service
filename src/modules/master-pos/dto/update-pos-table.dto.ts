import { PartialType } from '@nestjs/swagger';
import { CreatePosTableDto } from './create-pos-table.dto';

export class UpdatePosTableDto extends PartialType(CreatePosTableDto) {}