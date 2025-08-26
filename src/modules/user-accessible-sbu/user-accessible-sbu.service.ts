import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserAccessibleSbuDto } from "./dto/create-user-accessible-sbu.dto";
import { UpdateUserAccessibleSbuDto } from "./dto/update-user-accessible-sbu.dto";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { InjectRepository } from "@nestjs/typeorm";
import { UserAccessibleSbu } from "./entities/user-accessible-sbu.entity";
import { Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { getCurrentUser } from "src/common/utils/user.util";
import { GetUserAccessibleSbuDto } from "./dto/get-user-accessible-sbu.dto";
import { paginationResponse } from "src/utils/pagination-response.util";

@Injectable()
export class UserAccessibleSbuService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(UserAccessibleSbu)
        private readonly userAccessibleSbuRepo: Repository<UserAccessibleSbu>
    ) {}

    async create(dto: CreateUserAccessibleSbuDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newAccess = new UserAccessibleSbu();
            Object.assign(newAccess, dto);
            newAccess.created_by = Number(getCurrentUser("user_id"));

            const res = await transaction.save(UserAccessibleSbu, newAccess);

            await transaction.commitTransaction();
            return res;
        } catch (error) {
            console.error("error in create-user-access-sbu: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating user-access-sbu");
        } finally {
            await transaction.release();
        }
    }

    async findAll(dto: GetUserAccessibleSbuDto) {
        try {
            const { page_number = 1, limit, user_id } = dto;

            if (limit === undefined || limit === null) {
                const userAccess = await this.userAccessibleSbuRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { user_id },
                });

                return userAccess;
            } else {
                const [userAccess, total] =
                    await this.userAccessibleSbuRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { user_id },
                    });

                return paginationResponse({
                    data: userAccess,
                    total,
                    page: page_number,
                    limit,
                });
            }
        } catch (error) {
            console.error("error in find-all-user-access-sbu: ", error);
            handleError(error, "while getting all user-access-sbu");
        }
    }

    async findOne(room_type_id: number) {
        try {
            const userAccessSbu = await this.userAccessibleSbuRepo.findOne({
                where: { id: room_type_id },
            });
            if (!userAccessSbu) {
                throw new NotFoundException("userAccessSbu was not found");
            }

            return userAccessSbu;
        } catch (error) {
            console.error("error in find-one-userAccessSbu: ", error);
            handleError(error, "while getting userAccessSbu");
        }
    }

    async update(room_type_id: number, dto: UpdateUserAccessibleSbuDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updateduserAccessSbu = await transaction.update(
                UserAccessibleSbu,
                { id: room_type_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updateduserAccessSbu;
        } catch (error) {
            console.error("error in update-userAccessSbu: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating userAccessSbu");
        } finally {
            await transaction.release();
        }
    }

    async remove(room_type_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                UserAccessibleSbu,
                { id: room_type_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `userAccessSbu was deleted successfully`;
        } catch (error) {
            console.error("error in remove-userAccessSbu: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting userAccessSbu");
        } finally {
            await transaction.release();
        }
    }
}
