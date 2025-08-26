import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { CardType } from "../entities/master_credit_card.entity";

export class AddCardDto {
    @ApiProperty({
        description: "ID of the SBU (Strategic Business Unit)",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;

    @ApiProperty({
        description: "ID of the reservation",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    reservation_id: number;

    @ApiProperty({
        description: "Credit card number",
        example: "1234567890123456",
    })
    @IsString()
    card_number: string;

    @ApiProperty({
        description: "Name of the card holder",
        example: "John Doe",
    })
    @IsString()
    card_holder_name: string;

    @ApiProperty({
        description: "Expiry month of the card",
        example: 12,
    })
    @IsNumber()
    @Type(() => Number)
    expiry_month: number;

    @ApiProperty({
        description: "Expiry year of the card",
        example: 2025,
    })
    @IsNumber()
    @Type(() => Number)
    expiry_year: number;

    @ApiProperty({
        description: "CVV of the card",
        example: 123,
    })
    @IsNumber()
    @Type(() => Number)
    cvv: number;

    @ApiProperty({
        description: "Type of the card",
        enum: CardType,
        example: CardType.PHYSICAL_CARD,
    })
    @IsEnum(CardType)
    card_type: CardType;
}