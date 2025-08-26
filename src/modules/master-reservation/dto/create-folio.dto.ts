import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { FolioType } from "../entities/master_folios.entity";

export class CreateFolioDto {
    @ApiProperty({
        description: "ID of the guest",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    guest_id: number;

    @ApiProperty({
        description: "ID of the SBU (Strategic Business Unit)",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    sbu_id: number;

    @ApiProperty({
        description: "ID of the Room",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    room_id: number;

    @ApiProperty({
        description: "Type of folio",
        enum: FolioType,
        example: FolioType.GUEST,
    })
    @IsNotEmpty()
    @IsEnum(FolioType)
    folio_type: FolioType;

    @ApiProperty({
        description: "ID of the reservation",
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    reservation_id: number;
}
