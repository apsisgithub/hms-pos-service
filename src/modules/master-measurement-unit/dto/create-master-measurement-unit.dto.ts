import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
    IsString,
    Length,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsBoolean,
    IsEnum,
} from "class-validator";
import { MeasurementUnitStatus } from "../entities/master_measurement_unit.entity";

export class CreateMasterMeasurementUnitDto {
    @ApiProperty({ description: "ID of the SBU this unit belongs to" })
    @IsInt()
    @IsNotEmpty()
    sbu_id: number;

    @ApiProperty({
        description: "Name of the unit (e.g., Kilogram, Liter)",
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @ApiProperty({
        description: "Abbreviation of the unit (e.g., kg, L)",
        required: false,
        maxLength: 10,
    })
    @IsOptional()
    @IsString()
    @Length(1, 10)
    abbreviation?: string;

    @ApiProperty({
        description: "Is this unit active?",
        required: false,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean = true;

    @ApiProperty({
        description: "Status of the measurement unit",
        enum: MeasurementUnitStatus,
        default: MeasurementUnitStatus.Active,
    })
    @IsEnum(MeasurementUnitStatus)
    @IsNotEmpty()
    status: MeasurementUnitStatus = MeasurementUnitStatus.Active;
}
