import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
    CreateMasterRoleDto,
    PermissionPrivilege,
} from "./dto/create-master-role.dto";
import { UpdateMasterRoleDto } from "./dto/update-master-role.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterRole } from "./entities/master_roles.entity";
import { DataSource, Repository } from "typeorm";
import { handleError } from "src/utils/handle-error.util";
import { GetRolesDto } from "./dto/get-role-list.dto"; // Original DTO name
import { paginationResponse } from "src/utils/pagination-response.util";
import {
    QueryManagerService,
    TransactionService,
} from "src/common/query-manager/query.service";
import { getCurrentUser } from "src/common/utils/user.util"; // Ensure this import path is correct
import { MasterRolePermission } from "./entities/master_role_permission.entity";
import { MasterPermissionModules } from "./entities/master_permission_module.entity";
import { MasterPermissionAction } from "./entities/master_permission_actions.entity";

@Injectable()
export class MasterRolesService {
    constructor(
        @Inject() private readonly queryService: QueryManagerService,
        @InjectRepository(MasterRole)
        private readonly masterRoleRepo: Repository<MasterRole>,
        private readonly dataSource: DataSource,
        @InjectRepository(MasterRolePermission)
        private readonly rolePermissionRepo: Repository<MasterRolePermission>
    ) {}

    async createRole(dto: CreateMasterRoleDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            const newRole = new MasterRole();
            Object.assign(newRole, dto);
            newRole.created_by = Number(getCurrentUser("user_id"));

            const res = (await transaction.save(
                MasterRole,
                newRole
            )) as MasterRole;

            if (
                dto.permission_privileges &&
                dto.permission_privileges.length > 0
            ) {
                const role_previleges = dto.permission_privileges.map(
                    (permission) => {
                        const newRolePermission = new MasterRolePermission();
                        newRolePermission.role_id = res.id;
                        newRolePermission.permission_module_id =
                            permission.module_id;
                        newRolePermission.permission_actions_id =
                            permission.permission_action_ids;

                        newRolePermission.created_by = Number(
                            getCurrentUser("user_id")
                        );
                        return newRolePermission;
                    }
                );

                await transaction.save(MasterRolePermission, role_previleges);
            }

            await transaction.commitTransaction();

            return res;
        } catch (error) {
            console.error("error occurred in create-roles: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while creating role");
        } finally {
            await transaction.release();
        }
    }

    async findAllRoles(dto: GetRolesDto) {
        try {
            const { page_number = 1, limit, sbu_id } = dto; // Removed default limit to allow fetching all

            if (limit === undefined || limit === null) {
                const roleList = await this.masterRoleRepo.find({
                    order: {
                        id: "ASC",
                    },
                    where: { sbu_id },
                });

                return roleList; // Return all roles without pagination
            } else {
                const [roleList, total] =
                    await this.masterRoleRepo.findAndCount({
                        skip: (page_number - 1) * limit,
                        take: limit,
                        order: {
                            id: "ASC",
                        },
                        where: { sbu_id },
                    });

                return paginationResponse({
                    data: roleList,
                    total,
                    page: page_number,
                    limit: limit,
                });
            }
        } catch (error) {
            console.error("error occurred in find-all-roles: ", error);
            handleError(error, "while getting all roles"); // Added context to handleError
        }
    }

    async findRoleById(role_id: number) {
        try {
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
                [role_id]
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
            handleError(error, "while getting role"); // Added context to handleError
        }
    }

    async updateRole(role_id: number, dto: UpdateMasterRoleDto) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Extract permission_privileges from dto and create role update data without it
            const { permission_privileges, ...roleUpdateData } = dto;

            // Update the role details
            const updatedRole = await transaction.update(
                MasterRole,
                { id: role_id },
                {
                    ...roleUpdateData,
                    updated_by: Number(getCurrentUser("user_id")),
                }
            );

            // Handle permissions update if provided
            if (permission_privileges?.length) {
                await this.updateRolePermissions(
                    transaction,
                    role_id,
                    permission_privileges
                );
            }

            await transaction.commitTransaction();
            return updatedRole;
        } catch (error) {
            console.error("Error occurred in update-role: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while updating role");
        } finally {
            await transaction.release();
        }
    }

    async removeRole(role_id: number) {
        const transaction = await this.queryService.createTransaction();
        try {
            await transaction.startTransaction();

            // Directly soft delete without fetching the entity first
            await transaction.softDelete(
                MasterRole,
                { id: role_id },
                { deleted_by: Number(getCurrentUser("user_id")) } // Inject deleted_by directly
            );

            await transaction.commitTransaction();

            return `role was successfully deleted`;
        } catch (error) {
            console.error("error occurred in remove-role: ", error);
            await transaction.rollbackTransaction();
            handleError(error, "while deleting role"); // Added context to handleError
        } finally {
            await transaction.release();
        }
    }

    async getModuleList() {
        try {
            const permission_modules = await this.dataSource.query(
                `
                SELECT 
                    master_permission_modules.id as module_id,
                    master_permission_modules.name as module_name,
                    master_permission_modules.parent_id as module_parent_id,
                    master_permission_modules.menu_url as module_menu_url,
                    master_permission_modules.description as module_description
                FROM master_permission_modules
                WHERE status = 'active'
                `,
                []
            );

            const permission_actions = await this.dataSource.query(
                `
                SELECT 
                    master_permission_actions.id as action_id,
                    master_permission_actions.name as action_name
                FROM master_permission_actions
                WHERE status = 'Active'
                `,
                []
            );

            return {
                permission_modules,
                permission_actions,
            };
        } catch (error) {
            console.error("error occurred in getModuleList: ", error);
            handleError(error, "while getting all modules");
        }
    }

    private async updateRolePermissions(
        transaction: TransactionService,
        role_id: number,
        permission_privileges: PermissionPrivilege[]
    ) {
        await transaction.hardDelete(MasterRolePermission, { role_id });

        const permissionsToInsert = permission_privileges.flatMap((privilege) =>
            privilege.permission_action_ids.map((action_id) => ({
                role_id,
                permission_module_id: privilege.module_id,
                permission_actions_id: [action_id],
                created_by: Number(getCurrentUser("user_id")),
            }))
        );

        // Single bulk insert operation instead of loop
        if (permissionsToInsert.length > 0) {
            await transaction.save(MasterRolePermission, permissionsToInsert);
        }
    }
}
