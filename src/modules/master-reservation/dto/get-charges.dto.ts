import { IsOptional, IsNumber, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ChargeType, PostingType, ChargeRule } from "../entities/master_charges.entity";

export class GetChargesDto {
    
    @ApiProperty({
        description: "Filter by reservation ID",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    reservation_id?: number;

    @ApiProperty({
        description: "Filter by charge type",
        enum: ChargeType,
        required: false,
        example: ChargeType.ROOM_CHARGES,
    })
    @IsOptional()
    @IsEnum(ChargeType)
    type?: ChargeType;

    @ApiProperty({
        description: "Filter by posting type",
        enum: PostingType,
        required: false,
        example: PostingType.EVERY_DAY,
    })
    @IsOptional()
    @IsEnum(PostingType)
    posting_type?: PostingType;

    @ApiProperty({
        description: "Filter by charge rule",
        enum: ChargeRule,
        required: false,
        example: ChargeRule.PER_PERSON,
    })
    @IsOptional()
    @IsEnum(ChargeRule)
    charge_rule?: ChargeRule;

    @ApiProperty({
        description: "Page number for pagination",
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page_number?: number = 1;

    @ApiProperty({
        description: "Number of items per page",
        required: false,
        example: 10,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number = 10;
}