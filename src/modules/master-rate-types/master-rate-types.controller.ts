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
import { MasterRateTypesService } from "./master-rate-types.service";
import { CreateMasterRateTypeDto } from "./dto/create-master-rate-type.dto";
import { UpdateMasterRateTypeDto } from "./dto/update-master-rate-type.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetRateTypesDto } from "./dto/get-rate-types.dto";

@ApiTags("Rate Types")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-rate-types")
export class MasterRateTypesController {
    constructor(
        private readonly masterRateTypesService: MasterRateTypesService
    ) {}

    @Post()
    create(@Body() createMasterRateTypeDto: CreateMasterRateTypeDto) {
        return this.masterRateTypesService.createRateType(
            createMasterRateTypeDto
        );
    }

    @Get()
    findAll(@Query() dto: GetRateTypesDto) {
        return this.masterRateTypesService.findAllRateTypes(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterRateTypesService.findRateTypeById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterRateTypeDto: UpdateMasterRateTypeDto
    ) {
        return this.masterRateTypesService.updateRateType(
            +id,
            updateMasterRateTypeDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterRateTypesService.removeRateType(+id);
    }
}
