import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMasterCompanyDto } from "./dto/create-master-company.dto";
import { UpdateMasterCompanyDto } from "./dto/update-master-company.dto";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "./entities/master-companies.entity";
import { Repository } from "typeorm";
import { getCurrentUser } from "src/common/utils/user.util";
import { handleError } from "src/utils/handle-error.util";
import { paginationResponse } from "src/utils/pagination-response.util";
import { GetCompaniesDto } from "./dto/get-companies.dto";

@Injectable()
export class MasterCompaniesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>
    ) {}
    async create(dto: CreateMasterCompanyDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const companyData = {
                ...dto,
                created_by: Number(getCurrentUser("user_id")),
            };

            const result = await transaction.save(Company, companyData);
            await transaction.commitTransaction();

            return result;
        } catch (error) {
            console.error("error in create-company: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating company");
        } finally {
            await transaction.release();
        }
    }

    async findAll(dto: GetCompaniesDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const companyList = await this.companyRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return companyList;
            } else {
                const [companyList, total] =
                    await this.companyRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });

                return paginationResponse({
                    data: companyList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-companies ", error);
            handleError(error, "while getting all companies");
        }
    }

    async findOne(id: number) {
        try {
            const company = await this.companyRepo.findOne({
                where: { id },
            });

            if (!company) {
                throw new NotFoundException("company was not found");
            }

            return company;
        } catch (error) {
            console.error("error in find-one-business-agent: ", error);
            handleError(error, "while getting business-agent");
        }
    }

    async update(id: number, dto: UpdateMasterCompanyDto) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            const updatedCompany = await transaction.update(
                Company,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return updatedCompany;
        } catch (error) {
            console.error("error in update-company: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating company");
        } finally {
            await transaction.release();
        }
    }

    async remove(id: number) {
        const transaction = await this.queryService.createTransaction();

        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                Company,
                { id },
                {
                    deleted_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();

            return `company was deleted successfully`;
        } catch (error) {
            console.error("error in remove-company: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting company");
        } finally {
            await transaction.release();
        }
    }
}
