import { PartialType } from "@nestjs/swagger";
import { CreateMasterUserDto } from "../dto/create-user.dto";

export class UpdateMasterUserDto extends PartialType(CreateMasterUserDto) {}
