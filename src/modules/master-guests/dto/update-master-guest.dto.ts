import { PartialType } from "@nestjs/swagger";
import { CreateMasterGuestDto } from "./create-master-guest.dto";

export class UpdateMasterGuestDto extends PartialType(CreateMasterGuestDto) {}
