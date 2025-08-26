import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ChargeSubType } from "../entities/master_charges.entity";




export class CreateRoomChargeDto {
    @ApiProperty({
        description: "ID of the SBU (Strategic Business Unit)",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;
    
    @ApiProperty({
        description: "Discount ID",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    discount_id: number;
    
    @ApiProperty({
        description: "Discount amount",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    discount_amount: number;

   
    @ApiProperty({
        description:
            "Tax included or not",
        default: false,
    })
    @IsNotEmpty()
    @IsBoolean()
    is_tax_included?: boolean = false;

  

    @ApiProperty({
        description: "Charge amount",
        example: 150.75,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount: number;

    @ApiProperty({
        description: "description of the charge",
        example: "Late Chackout for no reason",
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: "Subtype of charge",
        enum: ChargeSubType,
        example: ChargeSubType.ROOM_CHARGES,
    })
    @IsNotEmpty()
    @IsEnum(ChargeSubType)
    sub_type: ChargeSubType;

    @ApiProperty({
        description: "ID of the folio",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    folio_id?: number;
}