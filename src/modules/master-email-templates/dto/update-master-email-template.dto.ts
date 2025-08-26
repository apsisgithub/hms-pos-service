import { PartialType } from '@nestjs/swagger';
import { CreateMasterEmailTemplateDto } from './create-master-email-template.dto';

export class UpdateMasterEmailTemplateDto extends PartialType(CreateMasterEmailTemplateDto) {}
