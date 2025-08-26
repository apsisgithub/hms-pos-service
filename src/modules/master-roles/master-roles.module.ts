import { Module } from "@nestjs/common";
import { MasterRolesService } from "./master-roles.service";
import { MasterRolesController } from "./master-roles.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterRole } from "./entities/master_roles.entity";
import { MasterRolePermission } from "./entities/master_role_permission.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterRole, MasterRolePermission])],
    controllers: [MasterRolesController],
    providers: [MasterRolesService],
})
export class MasterRolesModule {}
