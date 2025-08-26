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
import { MasterSeasonsService } from "./master-seasons.service";
import { CreateSeasonDto } from "./dto/create-master-season.dto";
import { UpdateMasterSeasonDto } from "./dto/update-master-season.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetSeasonsDto } from "./dto/get-seasons.dto";

@ApiTags("Seasons")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-seasons")
export class MasterSeasonsController {
    constructor(private readonly masterSeasonsService: MasterSeasonsService) {}

    @Post()
    create(@Body() createMasterSeasonDto: CreateSeasonDto) {
        return this.masterSeasonsService.createSeason(createMasterSeasonDto);
    }

    @Get()
    findAll(@Query() dto: GetSeasonsDto) {
        return this.masterSeasonsService.findAllSeasons(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterSeasonsService.findSeasonById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterSeasonDto: UpdateMasterSeasonDto
    ) {
        return this.masterSeasonsService.updateSeason(
            +id,
            updateMasterSeasonDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterSeasonsService.removeSeason(+id);
    }
}
