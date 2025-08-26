import { PartialType } from '@nestjs/swagger';
import { CreateMasterMeasurementUnitDto } from './create-master-measurement-unit.dto';

export class UpdateMasterMeasurementUnitDto extends PartialType(CreateMasterMeasurementUnitDto) {}
