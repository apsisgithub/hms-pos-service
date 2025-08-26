import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateReservationBillingDetailDto } from "./create-master-reservation-billing-info.dto";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class UpdateMasterReservationBillingInfoDto extends PartialType(
    CreateReservationBillingDetailDto
) {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    room_id?: number;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    apply_to_group?: false;
}
