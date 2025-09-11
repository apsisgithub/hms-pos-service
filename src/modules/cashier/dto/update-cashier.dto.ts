import { PartialType } from "@nestjs/swagger";
import { CreateCashierDto } from "./create-cashier.dto";

export class UpdateCashierDto extends PartialType(CreateCashierDto) {}
