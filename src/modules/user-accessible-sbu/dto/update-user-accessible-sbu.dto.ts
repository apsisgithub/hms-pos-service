import { PartialType } from '@nestjs/swagger';
import { CreateUserAccessibleSbuDto } from './create-user-accessible-sbu.dto';

export class UpdateUserAccessibleSbuDto extends PartialType(CreateUserAccessibleSbuDto) {}
