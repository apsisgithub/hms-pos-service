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
import { MasterCompaniesService } from "./master-companies.service";
import { CreateMasterCompanyDto } from "./dto/create-master-company.dto";
import { UpdateMasterCompanyDto } from "./dto/update-master-company.dto";
import { GetCompaniesDto } from "./dto/get-companies.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("Companies")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-companies")
export class MasterCompaniesController {
    constructor(
        private readonly masterCompaniesService: MasterCompaniesService
    ) {}

    @Post()
    create(@Body() createMasterCompanyDto: CreateMasterCompanyDto) {
        return this.masterCompaniesService.create(createMasterCompanyDto);
    }

    @Get()
    findAll(@Query() dto: GetCompaniesDto) {
        return this.masterCompaniesService.findAll(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterCompaniesService.findOne(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterCompanyDto: UpdateMasterCompanyDto
    ) {
        return this.masterCompaniesService.update(+id, updateMasterCompanyDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterCompaniesService.remove(+id);
    }
}
