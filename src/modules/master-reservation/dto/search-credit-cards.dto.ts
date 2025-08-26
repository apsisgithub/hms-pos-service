import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from "class-validator";
import { Transform } from "class-transformer";

export class SearchCreditCardsDto {
    @ApiProperty({
        description: "Credit card number or partial number to search for",
        example: "1234",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    search_term: string;

    @ApiProperty({
        description: "Page number for pagination",
        example: 1,
        required: false,
        default: 1,
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page_number?: number = 1;

    @ApiProperty({
        description: "Number of records per page",
        example: 10,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    limit?: number;
}