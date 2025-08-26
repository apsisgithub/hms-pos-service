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
import { MasterDisplaySettingsService } from "./master-display-settings.service";
import { CreateMasterDisplaySettingDto } from "./dto/create-master-display-setting.dto";
import { UpdateMasterDisplaySettingDto } from "./dto/update-master-display-setting.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetDisplaySettingsDto } from "./dto/get-display-settings.dto";
import { getTimezones } from "src/common/utils/timezone-list.util";

@ApiTags("Display Settings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-display-settings")
export class MasterDisplaySettingsController {
    constructor(
        private readonly masterDisplaySettingsService: MasterDisplaySettingsService
    ) {}

    @Post()
    create(
        @Body() createMasterDisplaySettingDto: CreateMasterDisplaySettingDto
    ) {
        return this.masterDisplaySettingsService.createDisplaySettings(
            createMasterDisplaySettingDto
        );
    }

    @Get()
    findAll(@Query() dto: GetDisplaySettingsDto) {
        return this.masterDisplaySettingsService.findAllDisplaySettings(dto);
    }

    @Get("timezone")
    getAllTimezone() {
        return getTimezones();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterDisplaySettingsService.findDisplaySettingsById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterDisplaySettingDto: UpdateMasterDisplaySettingDto
    ) {
        return this.masterDisplaySettingsService.updateDisplaySettings(
            +id,
            updateMasterDisplaySettingDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterDisplaySettingsService.removeDisplaySettings(+id);
    }
}
