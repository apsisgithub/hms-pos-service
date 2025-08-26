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
import { MasterRoomRatesService } from "./master-room-rates.service";
import { CreateMasterRoomRateDto } from "./dto/create-master-room-rate.dto";
import { UpdateMasterRoomRateDto } from "./dto/update-master-room-rate.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetRoomRatesDto } from "./dto/get-room-rates.dto";

@ApiTags("Room Rates")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-room-rates")
export class MasterRoomRatesController {
    constructor(
        private readonly masterRoomRatesService: MasterRoomRatesService
    ) {}

    @Post()
    create(@Body() createMasterRoomRateDto: CreateMasterRoomRateDto) {
        return this.masterRoomRatesService.createroomRate(
            createMasterRoomRateDto
        );
    }

    @Get()
    findAll(@Query() dto: GetRoomRatesDto) {
        return this.masterRoomRatesService.findAllRoomRates(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterRoomRatesService.findRoomRateById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterRoomRateDto: UpdateMasterRoomRateDto
    ) {
        return this.masterRoomRatesService.updateRoomRate(
            +id,
            updateMasterRoomRateDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterRoomRatesService.removeroomRate(+id);
    }
}
