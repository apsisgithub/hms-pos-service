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
import { MasterTaxesService } from "./master-taxes.service";
import { CreateMasterTaxDto } from "./dto/create-master-tax.dto";
import { UpdateMasterTaxDto } from "./dto/update-master-tax.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetTaxAmount, GetTaxesDto } from "./dto/get-taxes.dto";

@ApiTags("Taxes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-taxes")
export class MasterTaxesController {
    constructor(private readonly masterTaxesService: MasterTaxesService) {}

    @Post()
    create(@Body() createMasterTaxDto: CreateMasterTaxDto) {
        return this.masterTaxesService.createTax(createMasterTaxDto);
    }

    @Get()
    findAll(@Query() dto: GetTaxesDto) {
        return this.masterTaxesService.findAllTaxes(dto);
    }

    @Get('/amount')
    getTaxAmount(@Query() dto: GetTaxAmount) {
        return this.masterTaxesService.getTaxAmount(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterTaxesService.findTaxById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterTaxDto: UpdateMasterTaxDto
    ) {
        return this.masterTaxesService.updateTax(+id, updateMasterTaxDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterTaxesService.removeTax(+id);
    }
}
