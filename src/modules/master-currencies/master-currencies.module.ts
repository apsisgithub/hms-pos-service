import { Module } from "@nestjs/common";
import { MasterCurrenciesService } from "./master-currencies.service";
import { MasterCurrenciesController } from "./master-currencies.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterCurrency } from "./entities/master_currencies.entity";
import { HttpModule, HttpService } from "@nestjs/axios";
import { MasterCurrencyExchangeRates } from "./entities/master_currency_exchange_rate.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([MasterCurrency, MasterCurrencyExchangeRates]),
        HttpModule,
    ],
    controllers: [MasterCurrenciesController],
    providers: [MasterCurrenciesService],
})
export class MasterCurrenciesModule {}
