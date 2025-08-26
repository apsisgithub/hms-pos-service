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
import { BuildingsService } from "./buildings.service";
import { CreateMasterBuildingDto } from "./dto/create-building.dto";
import { UpdateBuildingDto } from "./dto/update-building.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { getCurrentUser } from "src/common/utils/user.util";
import { GetBuildingsDto } from "./dto/get-buildings.dto";

@ApiTags("Buildings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("buildings")
export class BuildingsController {
    constructor(private readonly buildingsService: BuildingsService) {}

    @Post()
    create(@Body() createBuildingDto: CreateMasterBuildingDto) {
        return this.buildingsService.createBuilding(createBuildingDto);
    }

    @Get("/user-check")
    findAlls() {
        return getCurrentUser();
    }

    @Get()
    findAll(@Query() dto: GetBuildingsDto) {
        return this.buildingsService.findAllBuildings(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.buildingsService.findBuildingById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateBuildingDto: UpdateBuildingDto
    ) {
        return this.buildingsService.updatebuilding(+id, updateBuildingDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.buildingsService.removebuilding(+id);
    }
}
