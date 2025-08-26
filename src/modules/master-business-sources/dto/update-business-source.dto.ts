import { PartialType } from "@nestjs/swagger";
import { CreateMasterBusinessSourceDto } from "./create-business-source.dto";

export class UpdateBusinessSourceDto extends PartialType(
    CreateMasterBusinessSourceDto
) {}
