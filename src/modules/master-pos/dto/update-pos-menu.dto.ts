import { PartialType } from '@nestjs/swagger';
import { CreatePosMenuDto } from './create-pos-menu.dto';

export class UpdatePosMenuDto extends PartialType(CreatePosMenuDto) {}