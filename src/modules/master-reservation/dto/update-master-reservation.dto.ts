import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateReservationDto } from "./create-master-reservation.dto";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ReservationStatus } from "../entities/master_reservation.entity";

export class UpdateMasterReservationDto extends PartialType(
    CreateReservationDto
) {}

export class UpdateReservationStatusDto {
    @ApiProperty({
        description: "The status of the reservation.",
        enum: ReservationStatus,
        default: ReservationStatus.CHECKED_IN,
        required: true, // Optional for creation as it has a default value
    })
    @IsNotEmpty()
    @IsEnum(ReservationStatus)
    status: ReservationStatus;
}
