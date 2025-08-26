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
import { MasterRolesService } from "./master-roles.service";
import { CreateMasterRoleDto } from "./dto/create-master-role.dto";
import { UpdateMasterRoleDto } from "./dto/update-master-role.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetRolesDto } from "./dto/get-role-list.dto";

@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-roles")
export class MasterRolesController {
    constructor(private readonly masterRolesService: MasterRolesService) {}

    @Post()
    create(@Body() createMasterRoleDto: CreateMasterRoleDto) {
        return this.masterRolesService.createRole(createMasterRoleDto);
    }

    @Get("/module-list")
    getModuleList() {
        return this.masterRolesService.getModuleList();
    }

    @Get("/list")
    findAll(@Query() dto: GetRolesDto) {
        return this.masterRolesService.findAllRoles(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterRolesService.findRoleById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterRoleDto: UpdateMasterRoleDto
    ) {
        return this.masterRolesService.updateRole(+id, updateMasterRoleDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterRolesService.removeRole(+id);
    }
}
