import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMasterDepartmentDto } from "./dto/create-master-department.dto";
import { UpdateMasterDepartmentDto } from "./dto/update-master-department.dto";
import { GetDepartmentsDto } from "./dto/get-departments.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterDepartment } from "./entities/master_departments.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { getCurrentUser } from "src/common/utils/user.util";
import { paginationResponse } from "src/utils/pagination-response.util";

@Injectable()
export class MasterDepartmentsService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterDepartment)
        private readonly departmentRepo: Repository<MasterDepartment>
    ) {}

    async createDepartment(dto: CreateMasterDepartmentDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const department = new MasterDepartment();
            Object.assign(department, dto);
            department.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(MasterDepartment, department);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-department: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating department");
        } finally {
            await transaction.release();
        }
    }

    async findAllDepartments(dto: GetDepartmentsDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto;

            if (limit === undefined || limit === null) {
                const departmentList = await this.departmentRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return departmentList;
            } else {
                const [departmentList, total] =
                    await this.departmentRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });

                return paginationResponse({
                    data: departmentList,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-department: ", error);
            handleError(error, "while getting all department");
        }
    }

    async findDepartmentById(id: number) {
        try {
            const department = await this.departmentRepo.findOne({
                where: { id },
            });
            if (!department) {
                throw new NotFoundException("department was not found");
            }

            return department;
        } catch (error) {
            console.error("error in find-one-department: ", error);
            handleError(error, "while getting department");
        }
    }

    async updateDepartment(id: number, dto: UpdateMasterDepartmentDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updatedDepartment = await transaction.update(
                MasterDepartment,
                { id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updatedDepartment;
        } catch (error) {
            console.error("error in update-department: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating department");
        } finally {
            await transaction.release();
        }
    }

    async removeDepartment(id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterDepartment,
                { id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `department was deleted successfully`;
        } catch (error) {
            console.error("error in remove-department: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting department");
        } finally {
            await transaction.release();
        }
    }
}
