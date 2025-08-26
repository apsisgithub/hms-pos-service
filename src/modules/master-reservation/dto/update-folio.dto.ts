import { IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { FolioType } from "../entities/master_folios.entity";

export class UpdateFolioDto {
    @ApiProperty({
        description: "Type of folio",
        enum: FolioType,
        required: false,
        example: FolioType.GUEST,
    })
    @IsOptional()
    @IsEnum(FolioType)
    folio_type?: FolioType;
}