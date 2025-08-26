import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from "@nestjs/common";
import { MasterCurrenciesService } from "./master-currencies.service";
import { CreateMasterCurrencyDto } from "./dto/create-master-currency.dto";
import { UpdateMasterCurrencyDto } from "./dto/update-master-currency.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetCurrenciesDto } from "./dto/get-currencies.dto";
import { getCountryList } from "src/common/utils/country-list.util";
import { HttpService } from "@nestjs/axios";
import { CreateExchangeRatesDto } from "./dto/create-exchange-rate.dto";
import { GetExchangeRatesDto } from "./dto/get-exchange-rates.dto";
import { UpdateExchangeRatesDto } from "./dto/update-exchange-rate.dto";

@ApiTags("Currency")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-currencies")
export class MasterCurrenciesController {
    constructor(
        private readonly masterCurrenciesService: MasterCurrenciesService,
        private readonly httpService: HttpService
    ) {}

    @Post()
    create(@Body() createMasterCurrencyDto: CreateMasterCurrencyDto) {
        return this.masterCurrenciesService.createCurrency(
            createMasterCurrencyDto
        );
    }

    @Post("exchange-rate")
    createExchange(@Body() dto: CreateExchangeRatesDto) {
        return this.masterCurrenciesService.createExchangeRate(dto);
    }

    @Get()
    findAll(@Query() dto: GetCurrenciesDto) {
        return this.masterCurrenciesService.findAllCurrencies(dto);
    }

    @Get("exchange-rate")
    findAllExchanges(@Query() dto: GetExchangeRatesDto) {
        return this.masterCurrenciesService.findAllExchangeRates(dto);
    }

    @Get("/country-list")
    getCountries() {
        return getCountryList(this.httpService);
    }

    @Get("exchange-rate/:exchange_rate_id")
    findOneExchange(@Param("exchange_rate_id") exchange_rate_id: string) {
        return this.masterCurrenciesService.findCurrencyExchangeRate(
            +exchange_rate_id
        );
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterCurrenciesService.findCurrencyById(+id);
    }

    @Patch("exchange-rate/:exchange_rate_id")
    updateExchange(
        @Param("exchange_rate_id") exchange_rate_id: string,
        @Body() dto: UpdateExchangeRatesDto
    ) {
        return this.masterCurrenciesService.updateExchange(
            +exchange_rate_id,
            dto
        );
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterCurrencyDto: UpdateMasterCurrencyDto
    ) {
        return this.masterCurrenciesService.updateCurrency(
            +id,
            updateMasterCurrencyDto
        );
    }

    @Delete("exchange-rate/:exchange_rate_id")
    removeExchange(@Param("exchange_rate_id") exchange_rate_id: string) {
        return this.masterCurrenciesService.removeExchangeRate(
            +exchange_rate_id
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterCurrenciesService.removeCurrency(+id);
    }
}
