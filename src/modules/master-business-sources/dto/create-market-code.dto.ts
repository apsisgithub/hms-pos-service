import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMarketCode {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    market_code_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    sbu_id: number;
}
