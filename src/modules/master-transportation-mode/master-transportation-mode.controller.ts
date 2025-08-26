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
import { MasterTransportationModeService } from "./master-transportation-mode.service";
import { CreateMasterTransportationModeDto } from "./dto/create-master-transportation-mode.dto";
import { UpdateMasterTransportationModeDto } from "./dto/update-master-transportation-mode.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetTransportationModesDto } from "./dto/get-transportation-modes.dto";

@ApiTags("Transportation Mode")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-transportation-mode")
export class MasterTransportationModeController {
    constructor(
        private readonly masterTransportationModeService: MasterTransportationModeService
    ) {}

    @Post()
    create(
        @Body()
        createMasterTransportationModeDto: CreateMasterTransportationModeDto
    ) {
        return this.masterTransportationModeService.createTransportationMode(
            createMasterTransportationModeDto
        );
    }

    @Get()
    findAll(@Query() dto: GetTransportationModesDto) {
        return this.masterTransportationModeService.findAllTransportationModes(
            dto
        );
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterTransportationModeService.findTransportationModeById(
            +id
        );
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body()
        updateMasterTransportationModeDto: UpdateMasterTransportationModeDto
    ) {
        return this.masterTransportationModeService.updateTransportationMode(
            +id,
            updateMasterTransportationModeDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterTransportationModeService.removeTransportationMode(
            +id
        );
    }
}
