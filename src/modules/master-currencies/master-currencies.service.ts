import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMasterCurrencyDto } from "./dto/create-master-currency.dto";
import { UpdateMasterCurrencyDto } from "./dto/update-master-currency.dto";
import { GetCurrenciesDto } from "./dto/get-currencies.dto";
import { InjectRepository } from "@nestjs/typeorm";
import {
    CurrencyStatus,
    MasterCurrency,
} from "./entities/master_currencies.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { getCurrentUser } from "src/common/utils/user.util";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCountryList } from "src/common/utils/country-list.util";
import { CreateExchangeRatesDto } from "./dto/create-exchange-rate.dto";
import { MasterCurrencyExchangeRates } from "./entities/master_currency_exchange_rate.entity";
import { UpdateExchangeRatesDto } from "./dto/update-exchange-rate.dto";
import { GetExchangeRatesDto } from "./dto/get-exchange-rates.dto";

@Injectable()
export class MasterCurrenciesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterCurrency)
        private readonly currencyRepo: Repository<MasterCurrency>,
        @InjectRepository(MasterCurrencyExchangeRates)
        private readonly exchangeRepo: Repository<MasterCurrencyExchangeRates>
    ) {}

    async createCurrency(dto: CreateMasterCurrencyDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const currency = new MasterCurrency();
            Object.assign(currency, dto);
            currency.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterCurrency, currency);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-currency: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating currency");
        } finally {
            await transaction.release();
        }
    }

    async findAllCurrencies(dto: GetCurrenciesDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const currencyList = await this.currencyRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id, status: CurrencyStatus.Active },
                });

                return currencyList;
            } else {
                const [currencyList, total] =
                    await this.currencyRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id, status: CurrencyStatus.Active },
                    });

                return paginationResponse({
                    data: currencyList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-currency: ", error);
            handleError(error, "while getting all currency");
        }
    }

    async findCurrencyById(id: number) {
        try {
            const currency = await this.currencyRepo.findOne({
                where: { id },
            });
            if (!currency) {
                throw new NotFoundException("currency was not found");
            }

            return currency;
        } catch (error) {
            console.error("error in find-one-currency: ", error);
            handleError(error, "while getting currency");
        }
    }

    async updateCurrency(id: number, dto: UpdateMasterCurrencyDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedCurrency = await transaction.update(
                MasterCurrency,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedCurrency;
        } catch (error) {
            console.error("error in update-currency: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating currency");
        } finally {
            await transaction.release();
        }
    }

    async removeCurrency(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterCurrency,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `currency was deleted successfully`;
        } catch (error) {
            console.error("error in remove-currency: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting currency");
        } finally {
            await transaction.release();
        }
    }

    async createExchangeRate(dto: CreateExchangeRatesDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const exchange = new MasterCurrencyExchangeRates();
            Object.assign(exchange, dto);
            exchange.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(
                MasterCurrencyExchangeRates,
                exchange
            );

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-exchange: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating exchange");
        } finally {
            await transaction.release();
        }
    }

    async findAllExchangeRates(dto: GetExchangeRatesDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const exchangeList = await this.exchangeRepo.find({
                    order: {
                        id: "ASC",
                    },
                });

                return exchangeList;
            } else {
                const [exchangeList, total] =
                    await this.exchangeRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                    });

                return paginationResponse({
                    data: exchangeList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-exchange-rate: ", error);
            handleError(error, "while getting all exchange-rate");
        }
    }

    async findCurrencyExchangeRate(id: number) {
        try {
            const exchange = await this.exchangeRepo.findOne({
                where: { id },
            });
            if (!exchange) {
                throw new NotFoundException("exchange was not found");
            }

            return exchange;
        } catch (error) {
            console.error("error in find-one-exchange: ", error);
            handleError(error, "while getting exchange");
        }
    }

    async updateExchange(id: number, dto: UpdateExchangeRatesDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedExchange = await transaction.update(
                MasterCurrencyExchangeRates,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedExchange;
        } catch (error) {
            console.error("error in update-exchange: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating exchange");
        } finally {
            await transaction.release();
        }
    }

    async removeExchangeRate(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterCurrencyExchangeRates,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `exchange was deleted successfully`;
        } catch (error) {
            console.error("error in remove-exchange: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting exchange");
        } finally {
            await transaction.release();
        }
    }
}
