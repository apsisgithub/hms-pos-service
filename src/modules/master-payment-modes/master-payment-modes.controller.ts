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
import { MasterPaymentModesService } from "./master-payment-modes.service";
import { CreateMasterPaymentModeDto } from "./dto/create-master-payment-mode.dto";
import { UpdateMasterPaymentModeDto } from "./dto/update-master-payment-mode.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetPaymentModesDto } from "./dto/get-payment-modes.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("Payment Mode")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-payment-modes")
export class MasterPaymentModesController {
    constructor(
        private readonly masterPaymentModesService: MasterPaymentModesService
    ) {}

    @Post()
    create(@Body() createMasterPaymentModeDto: CreateMasterPaymentModeDto) {
        return this.masterPaymentModesService.createPaymentMode(
            createMasterPaymentModeDto
        );
    }

    @Get()
    findAll(@Query() dto: GetPaymentModesDto) {
        return this.masterPaymentModesService.findAllPaymentModes(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterPaymentModesService.findPaymentModeById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterPaymentModeDto: UpdateMasterPaymentModeDto
    ) {
        return this.masterPaymentModesService.updatePaymentMode(
            +id,
            updateMasterPaymentModeDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterPaymentModesService.removePaymentMode(+id);
    }
}
