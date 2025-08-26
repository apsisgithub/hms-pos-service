import { IsNotEmpty, IsNumber, IsOptional, IsString, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class TransferAmountDto {
    @ApiProperty({
        description: "ID of the source folio to transfer from",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    source_folio_id: number;

    @ApiProperty({
        description: "ID of the target folio to transfer to",
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
        description: "Amount to transfer (if not provided, will transfer the full due amount)",
        example: 150.75,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    amount?: number;

    @ApiProperty({
        description: "Description for the transfer transaction",
        example: "Transfer due amount to corporate folio",
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

   
}