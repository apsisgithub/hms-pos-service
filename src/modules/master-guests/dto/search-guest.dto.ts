import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from "class-validator";

export enum SearchField {
    NAME = 'name',
    EMAIL = 'email',
    CONTACT_NO = 'contact_no'
}

export class SearchGuestDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        description: "Search term for guest",
        type: String,
        required: true,
        example: "John Doe"
    })
    search_term: string;

    @IsOptional()
    @IsEnum(SearchField)
    @ApiProperty({
        description: "Field to search in",
        enum: SearchField,
        required: false,
        example: SearchField.NAME,
        default: SearchField.NAME
    })
    field?: SearchField;
}