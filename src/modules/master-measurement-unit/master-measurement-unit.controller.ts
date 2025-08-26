import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from "@nestjs/common";
import { MasterMeasurementUnitService } from "./master-measurement-unit.service";
import { CreateMasterMeasurementUnitDto } from "./dto/create-master-measurement-unit.dto";
import { UpdateMasterMeasurementUnitDto } from "./dto/update-master-measurement-unit.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetMeasurementUnitsDto } from "./dto/get-measurement-units.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("Measurement Unit")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-measurement-unit")
export class MasterMeasurementUnitController {
    constructor(
        private readonly masterMeasurementUnitService: MasterMeasurementUnitService
    ) {}

    @Post()
    create(
        @Body() createMasterMeasurementUnitDto: CreateMasterMeasurementUnitDto
    ) {
        return this.masterMeasurementUnitService.createMeasurementUnit(
            createMasterMeasurementUnitDto
        );
    }

    @Get()
    findAll(@Query() dto: GetMeasurementUnitsDto) {
        return this.masterMeasurementUnitService.findAllMeasurementUnits(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterMeasurementUnitService.findMeasurementUnitById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterMeasurementUnitDto: UpdateMasterMeasurementUnitDto
    ) {
        return this.masterMeasurementUnitService.updateMeasurementUnit(
            +id,
            updateMasterMeasurementUnitDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterMeasurementUnitService.removeMeasurementUnit(+id);
    }
}
