import { IsNotEmpty, IsNumber, IsArray, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class SplitFolioDto {
    @ApiProperty({
        description: "ID of the source folio to split from",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    source_folio_id: number;

    @ApiProperty({
        description: "ID of the target folio to split to",
        example: 2,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    target_folio_id: number;

    @ApiProperty({
        description: "ID of the SBU (Strategic Business Unit)",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;

    @ApiProperty({
        description: "Array of charge IDs to move to the target folio",
        example: [1, 2, 3],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    charge_ids?: number[];

    @ApiProperty({
        description: "Array of payment IDs to move to the target folio",
        example: [1, 2],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    payment_ids?: number[];

    @ApiProperty({
        description: "Reason for splitting the folio",
        example: "Splitting charges between guests",
        required: false,
    })
    @IsOptional()
    @IsString()
    reason?: string;
}