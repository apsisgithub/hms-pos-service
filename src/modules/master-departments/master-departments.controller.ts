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
import { MasterDepartmentsService } from "./master-departments.service";
import { CreateMasterDepartmentDto } from "./dto/create-master-department.dto";
import { UpdateMasterDepartmentDto } from "./dto/update-master-department.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetDepartmentsDto } from "./dto/get-departments.dto";

@ApiTags("Departments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-departments")
export class MasterDepartmentsController {
    constructor(
        private readonly masterDepartmentsService: MasterDepartmentsService
    ) {}

    @Post()
    create(@Body() createMasterDepartmentDto: CreateMasterDepartmentDto) {
        return this.masterDepartmentsService.createDepartment(
            createMasterDepartmentDto
        );
    }

    @Get()
    findAll(@Query() dto: GetDepartmentsDto) {
        return this.masterDepartmentsService.findAllDepartments(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterDepartmentsService.findDepartmentById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterDepartmentDto: UpdateMasterDepartmentDto
    ) {
        return this.masterDepartmentsService.updateDepartment(
            +id,
            updateMasterDepartmentDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterDepartmentsService.removeDepartment(+id);
    }
}
