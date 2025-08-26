import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateMasterGuestDto } from "./create-master-guest.dto";

export class UpdateReservedGuestDto extends PartialType(CreateMasterGuestDto) {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    room_id: number;
}
