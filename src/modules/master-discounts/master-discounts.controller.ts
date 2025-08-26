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
import { MasterDiscountsService } from "./master-discounts.service";
import { CreateMasterDiscountDto } from "./dto/create-master-discount.dto";
import { UpdateMasterDiscountDto } from "./dto/update-master-discount.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetDiscountsDto } from "./dto/get-discounts.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("Discounts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-discounts")
export class MasterDiscountsController {
    constructor(
        private readonly masterDiscountsService: MasterDiscountsService
    ) {}

    @Post()
    create(@Body() createMasterDiscountDto: CreateMasterDiscountDto) {
        return this.masterDiscountsService.createDiscount(
            createMasterDiscountDto
        );
    }

    @Get()
    findAll(@Query() dto: GetDiscountsDto) {
        return this.masterDiscountsService.findAllDiscounts(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterDiscountsService.findDiscountById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterDiscountDto: UpdateMasterDiscountDto
    ) {
        return this.masterDiscountsService.updateDiscount(
            +id,
            updateMasterDiscountDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterDiscountsService.removeDiscount(+id);
    }
}
