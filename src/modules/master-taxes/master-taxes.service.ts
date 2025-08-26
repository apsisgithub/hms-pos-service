import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Inject,
} from "@nestjs/common";
import { CreateMasterTaxDto } from "./dto/create-master-tax.dto";
import { UpdateMasterTaxDto } from "./dto/update-master-tax.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterTax, TaxStatus } from "./entities/master_tax.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { GetTaxAmount, GetTaxesDto } from "./dto/get-taxes.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class MasterTaxesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterTax)
        private readonly taxRepo: Repository<MasterTax>
    ) { }

    async createTax(dto: CreateMasterTaxDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newTax = new MasterTax();
            Object.assign(newTax, dto);
            newTax.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterTax, newTax);
            if (!res) {
                throw new InternalServerErrorException("cannot create tax");
            }

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-tax: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating tax");
        } finally {
            await transaction.release();
        }
    }

    async findAllTaxes(dto: GetTaxesDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const taxList = await this.taxRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return taxList;
            } else {
                const [taxList, total] = await this.taxRepo.findAndCount({
                    skip: (page_number - 1) * limit,
                    take: limit,
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return paginationResponse({
                    data: taxList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-tax: ", error);
            handleError(error, "while getting all tax");
        }
    }

    async findTaxById(tax_id: number) {
        try {
            const tax = await this.taxRepo.findOne({
                where: { id: tax_id },
            });
            if (!tax) {
                throw new NotFoundException("tax was not found");
            }

            return tax;
        } catch (error) {
            console.error("error in find-one-tax: ", error);
            handleError(error, "while getting tax");
        }
    }

    async updateTax(tax_id: number, dto: UpdateMasterTaxDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedTax = await transaction.update(
                MasterTax,
                { id: tax_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedTax;
        } catch (error) {
            console.error("error in update-tax: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating tax");
        } finally {
            await transaction.release();
        }
    }

    async removeTax(tax_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterTax,
                { id: tax_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `tax was deleted successfully`;
        } catch (error) {
            console.error("error in remove-tax: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting tax");
        } finally {
            await transaction.release();
        }
    }

    async getTaxAmount(dto: GetTaxAmount) {
        try {
            const { amount } = dto;

            const activeTaxes = await this.taxRepo.find({
                where: {
                    status: TaxStatus.Active
                },
                order: { id: "ASC" }
            });

            if (!activeTaxes || activeTaxes.length === 0) {
                return {
                    original_amount: amount,
                    total_tax_amount: 0,
                    total_amount: amount,
                    taxes_applicable: false,
                    reason: "No active tax configurations found",
                    tax_breakdown: []
                };
            }

            let totalTaxAmount = 0;
            const taxBreakdown: any[] = [];

            // Calculate tax for each active tax configuration
            for (const tax of activeTaxes) {
                let taxAmount = 0;
                let isApplicable = true;
                let reason = "";

                // Check if amount meets minimum threshold
                if (tax.apply_after_amount && amount < tax.apply_after_amount) {
                    isApplicable = false;
                    reason = `Tax applies only after amount ${tax.apply_after_amount}`;
                } else {
                    // Calculate tax based on tax type
                    switch (tax.tax_type) {
                        case "percentage":
                            // For percentage: tax_rate is stored as percentage (e.g., 10.5 for 10.5%)
                            taxAmount = (amount * tax.tax_rate) / 100;
                            break;
                        case "fixed":
                            // For fixed: tax_rate is the fixed amount
                            taxAmount = tax.tax_rate;
                            break;
                        default:
                            taxAmount = 0;
                            isApplicable = false;
                            reason = "Unknown tax type";
                            break;
                    }

                    // Round to 2 decimal places
                    taxAmount = Math.round(taxAmount * 100) / 100;
                }

                // Add to total if applicable
                if (isApplicable) {
                    totalTaxAmount += taxAmount;
                }

                
                taxBreakdown.push({
                    tax_id: tax.id,
                    tax_name: tax.name,
                    tax_short_name: tax.short_name,
                    tax_rate: tax.tax_rate,
                    tax_type: tax.tax_type,
                    tax_amount: taxAmount,
                    applicable: isApplicable,
                    reason: reason || "Tax applied successfully",
                    formula: isApplicable
                        ? (tax.tax_type === "percentage"
                            ? `${amount} × ${tax.tax_rate}% = ${taxAmount}`
                            : `Fixed amount = ${taxAmount}`)
                        : "Not applicable"
                });
            }

            // Round total tax amount to 2 decimal places
            totalTaxAmount = Math.round(totalTaxAmount * 100) / 100;
            const totalAmount = amount + totalTaxAmount;

            return {
                original_amount: amount,
                total_tax_amount: totalTaxAmount,
                total_amount: totalAmount,
                taxes_applicable: totalTaxAmount > 0,
                number_of_taxes: activeTaxes.length,
                applicable_taxes: taxBreakdown.filter(tax => tax.applicable).length,
                tax_breakdown: taxBreakdown,
                summary: {
                    base_amount: amount,
                    total_taxes: totalTaxAmount,
                    final_amount: totalAmount,
                    tax_percentage: amount > 0 ? Math.round((totalTaxAmount / amount) * 10000) / 100 : 0
                }
            };

        } catch (error) {
            console.error("error in getTaxAmount: ", error);
            handleError(error, "while calculating tax amount");
        }
    }
}
