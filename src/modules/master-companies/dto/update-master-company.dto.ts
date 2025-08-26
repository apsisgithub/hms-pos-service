import { PartialType } from '@nestjs/swagger';
import { CreateMasterCompanyDto } from './create-master-company.dto';

export class UpdateMasterCompanyDto extends PartialType(CreateMasterCompanyDto) {}
