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
import { MasterBusinessSourceService } from "./business-sources.service";
import { CreateMasterBusinessSourceDto } from "./dto/create-business-source.dto";
import { UpdateBusinessSourceDto } from "./dto/update-business-source.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetBusinessSourcesDto } from "./dto/get-buisiness-source.dto";
import { CreateMarketCode } from "./dto/create-market-code.dto";
import { GetMarketCodeDto } from "./dto/get-market-code.dto";

@ApiTags("Business Source")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("business-sources")
export class BusinessSourcesController {
    constructor(
        private readonly businessSourcesService: MasterBusinessSourceService
    ) {}

    @Post()
    create(@Body() createBusinessSourceDto: CreateMasterBusinessSourceDto) {
        return this.businessSourcesService.createBusinessSource(
            createBusinessSourceDto
        );
    }

    @Post("market-code")
    createMarket(@Body() dto: CreateMarketCode) {
        return this.businessSourcesService.createMarketCode(dto);
    }

    @Get()
    findAll(@Query() dto: GetBusinessSourcesDto) {
        return this.businessSourcesService.findAllBusinessSources(dto);
    }

    @Get("market-code")
    findAllMarketCode(@Query() dto: GetMarketCodeDto) {
        return this.businessSourcesService.getAllMarketCodes(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.businessSourcesService.findBusinessSourceById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateBusinessSourceDto: UpdateBusinessSourceDto
    ) {
        return this.businessSourcesService.updateBusinessSource(
            +id,
            updateBusinessSourceDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.businessSourcesService.removeBusinessSource(+id);
    }
}
