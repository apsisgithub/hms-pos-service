import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";

export class CutFolioDto {
    @ApiProperty({
        description: "ID of the folio to cut",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    folio_id: number;

    @ApiProperty({
        description: "ID of the SBU (Strategic Business Unit)",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;

    @ApiProperty({
        description: "Whether to move all charges to the new folio",
        example: true,
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    charges?: boolean = false;

    @ApiProperty({
        description: "Whether to move all payments to the new folio",
        example: true,
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    payments?: boolean = false;

    @ApiProperty({
        description: "Reason for cutting the folio",
        example: "Guest requested separate billing",
        required: false,
    })
    @IsOptional()
    @IsString()
    reason?: string;
}