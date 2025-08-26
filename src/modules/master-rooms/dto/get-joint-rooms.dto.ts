import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class GetJointRoomsDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "page-number of the list of joint-rooms",
        type: Number,
        required: false,
    })
    page_number?: number;

    @IsOptional()
    @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
    @IsNumber()
    @IsPositive()
    @ApiProperty({
        description: "limit for fetching limited number of data",
        type: Number,
        required: false,
    })
    limit?: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: "fetch hotel wise",
        type: Number,
        required: true,
    })
    sbu_id: number;
}
