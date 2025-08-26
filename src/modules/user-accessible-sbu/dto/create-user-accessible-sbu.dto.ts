// src/modules/user-accessible-sbu/dto/create-user-accessible-sbu.dto.ts
import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateUserAccessibleSbuDto {
    @ApiProperty({
        description: "The ID of the user",
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    user_id: number;

    @ApiProperty({
        description:
            "The ID of the Strategic Business Unit (SBU) accessible to the user",
        example: 101,
    })
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;
}
