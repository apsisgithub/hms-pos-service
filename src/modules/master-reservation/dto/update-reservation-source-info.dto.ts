import { PartialType } from "@nestjs/swagger";

import { CreateReservationSourceInfoDto } from "./create-reservation-source-info.dto";

export class UpdateReservationSourceInfoDto extends PartialType(
    CreateReservationSourceInfoDto
) {}
