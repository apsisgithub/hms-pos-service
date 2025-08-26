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
import { MasterExtraChargesService } from "./master-extra-charges.service";
import { CreateMasterExtraChargeDto } from "./dto/create-master-extra-charge.dto";
import { UpdateMasterExtraChargeDto } from "./dto/update-master-extra-charge.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { GetExtraChargessDto } from "./dto/get-extra-charges.dto";

@ApiTags("Extra Charges")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-extra-charges")
export class MasterExtraChargesController {
    constructor(
        private readonly masterExtraChargesService: MasterExtraChargesService
    ) {}

    @Post()
    create(@Body() createMasterExtraChargeDto: CreateMasterExtraChargeDto) {
        return this.masterExtraChargesService.create(
            createMasterExtraChargeDto
        );
    }

    @Get()
    findAll(@Query() dto: GetExtraChargessDto) {
        return this.masterExtraChargesService.findAll(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterExtraChargesService.findOne(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterExtraChargeDto: UpdateMasterExtraChargeDto
    ) {
        return this.masterExtraChargesService.update(
            +id,
            updateMasterExtraChargeDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterExtraChargesService.remove(+id);
    }
}
