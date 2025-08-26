import { PartialType } from "@nestjs/swagger";
import { CreateExchangeRatesDto } from "./create-exchange-rate.dto";

export class UpdateExchangeRatesDto extends PartialType(
    CreateExchangeRatesDto
) {}
