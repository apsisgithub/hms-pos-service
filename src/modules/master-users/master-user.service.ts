import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Inject,
    BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterUser } from "./entities/master_user.entity";
import { DataSource, Repository } from "typeorm";
import { QueryManagerService } from "src/common/query-manager/query.service";
import { CreateMasterUserDto } from "./dto/create-user.dto";
import { handleError } from "src/utils/handle-error.util";
import { getCurrentUser } from "src/common/utils/user.util";
import { GetUsersDto } from "./dto/get-user.dto";
import { paginationResponse } from "src/utils/pagination-response.util";
import { UpdateMasterUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { UserPermission } from "./entities/master_user_permission.entity";
import { permission } from "process";

@Injectable()
export class MasterUserService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,

        @InjectRepository(MasterUser)
        private readonly masterUserRepo: Repository<MasterUser>,
        private readonly dataSource: DataSource
    ) {}

    async getAccessList(role_id?: number) {
        try {
            const user_role_id = getCurrentUser("user_role_id");
            const result = await this.dataSource.query(
                `
                    SELECT 
                    role.id as role_id,
                    role.name as role_name,
                    permissionModule.id as module_id,
                    permissionModule.name as module_name,
                    permissionModule.parent_id as module_parent_id,
                    permissionModule.menu_url as module_menu_url,
                    permissionModule.description as module_description,
                    permissionAction.id as action_id,
                    permissionAction.name as action_name

                FROM master_roles role
                LEFT JOIN master_role_permissions rolePermission ON rolePermission.role_id = role.id AND rolePermission.deleted_at IS NULL
                LEFT JOIN master_permission_modules permissionModule ON permissionModule.id = rolePermission.permission_module_id AND permissionModule.deleted_at IS NULL  
                LEFT JOIN master_permission_actions permissionAction ON JSON_CONTAINS(rolePermission.permission_actions_id, CAST(permissionAction.id AS JSON)) AND permissionAction.deleted_at IS NULL

                WHERE role.id = ? AND role.deleted_at IS NULL;
                `,
                [role_id ?? user_role_id]
            );

            if (!result || result.length === 0) {
                throw new NotFoundException("role was not found");
            }

            // Transform the result to the desired format
            const response: {
                id: number;
                name: string;
                permissions: Array<{
                    id: number;
                    name: string;
                    parent_id: number | null;
                    menu_url: string | null;
                    description: string | null;
                    actions: Array<{
                        id: number;
                        name: string;
                    }>;
                }>;
            } = {
                id: result[0].role_id,
                name: result[0].role_name,
                permissions: [],
            };

            // Group by modules
            const moduleMap = new Map();

            result.forEach((row) => {
                if (row.module_id) {
                    if (!moduleMap.has(row.module_id)) {
                        moduleMap.set(row.module_id, {
                            id: row.module_id,
                            name: row.module_name,
                            parent_id: row.module_parent_id,
                            menu_url: row.module_menu_url,
                            description: row.module_description,
                            actions: [],
                        });
                    }

                    // Add action if it exists and not already added
                    if (row.action_id) {
                        const module = moduleMap.get(row.module_id);
                        const actionExists = module.actions.some(
                            (action) => action.id === row.action_id
                        );

                        if (!actionExists) {
                            module.actions.push({
                                id: row.action_id,
                                name: row.action_name,
                            });
                        }
                    }
                }
            });

            response.permissions = Array.from(moduleMap.values());

            return response;
        } catch (error) {
            console.error("error occurred in find-role-by-id: ", error);
            handleError(error, "while getting role");
        }
    }

    async createUser(dto: CreateMasterUserDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();
            const hashPass = await this.hashedPass(dto.password);

            const newUser = new MasterUser();
            Object.assign(newUser, dto);
            newUser.created_by = Number(getCurrentUser("user_id"));
            newUser.password = hashPass;

            const res = (await transaction.save(
                MasterUser,
                newUser
            )) as MasterUser;

            let finalPermissions: {
                permission_module_id: number;
                permission_actions_id: number[];
            }[];

            if (dto.permissions && dto.permissions.length > 0) {
                finalPermissions = dto.permissions;
            } else {
                const rolPermissions = await transaction.query(
                    `
                    SELECT permission_module_id,
                        permission_actions_id
                    FROM role_permissions
                    WHERE role_id = ?`[dto.user_role_id]
                );

                finalPermissions = rolPermissions.map((per) => ({
                    permission_module_id: per.permission_module_id,
                    pemission_actions_id: per.permission_actions_id,
                }));
            }

            if (finalPermissions.length > 0) {
                const userPermissions = finalPermissions.map((per) => ({
                    user_id: res.id,
                    permission_module_id: per.permission_module_id,
                    permission_actions_id: per.permission_actions_id,
                }));

                await transaction.bulkInsert(UserPermission, userPermissions);
            }

            await transaction.commitTransaction();

            return `user created succeffully`;
        } catch (error) {
            console.error("error in create-user: ", error);
            await transaction.rollbackTransaction();
            handleError(error);
        } finally {
            await transaction.release();
        }
    }

    async findAllUsers(dto: GetUsersDto) {
        try {
            const { page_number = 1, limit } = dto;
            let userList: MasterUser[];
            let total = 0;

            if (limit === undefined || limit === null) {
                userList = await this.masterUserRepo.find({
                    order: { id: "ASC" },
                });
            } else {
                const [users, count] = await this.masterUserRepo.findAndCount({
                    skip: (page_number - 1) * limit,
                    take: limit,
                    order: { id: "ASC" },
                });
                userList = users;
                total = count;
            }

            const enrichedUsers = await Promise.all(
                userList.map(async (user) => {
                    const access = await this.getAccessList(user.user_role_id);
                    return {
                        ...user,
                        accesses: access?.permissions || [],
                    };
                })
            );

            if (limit === undefined || limit === null) {
                return enrichedUsers;
            }

            return paginationResponse({
                data: enrichedUsers,
                total,
                page: page_number,
                limit,
            });
        } catch (error) {
            console.error("error in find-all-user: ", error);
            handleError(error, "while getting all user");
        }
    }

    async findUserById(user_id: number) {
        try {
            const user = await this.masterUserRepo.findOne({
                where: { id: user_id },
            });

            if (!user) {
                throw new NotFoundException("user was not found");
            }

            const access = await this.getAccessList(user.user_role_id);

            return {
                ...user,
                accesses: access?.permissions || [],
            };
        } catch (error) {
            console.error("error in find-one-user: ", error);
            handleError(error, "while getting user");
        }
    }

    async updateUser(user_id: number, dto: UpdateMasterUserDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const updateduser = await transaction.update(
                MasterUser,
                { id: user_id },
                {
                    ...dto,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            await transaction.commitTransaction();
            return updateduser;
        } catch (error) {
            console.error("error in update-user: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating user");
        } finally {
            await transaction.release();
        }
    }

    async removeUser(user_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            await transaction.softDelete(
                MasterUser,
                { id: user_id },
                { deleted_by: Number(getCurrentUser("user_id")) }
            );

            await transaction.commitTransaction();
            return `user was deleted successfully`;
        } catch (error) {
            console.error("error in remove-user: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting user");
        } finally {
            await transaction.release();
        }
    }

    async hashedPass(password: any) {
        const saltRounds = Number(process.env.SALT_HASH);
        if (!saltRounds) {
            throw new InternalServerErrorException("something went wrong");
        }
        return await bcrypt.hash(password, saltRounds);
    }
}
