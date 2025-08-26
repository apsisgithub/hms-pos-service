import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class GetUserAccessibleSbuDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "page-number of the list of user access",
        type: Number,
        required: false,
    })
    page_number?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "limit for fetching limited number of data",
        type: Number,
        required: false,
    })
    limit?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "fetch  user accessible hotels based on userID",
        type: Number,
        required: true,
    })
    user_id: number;
}
