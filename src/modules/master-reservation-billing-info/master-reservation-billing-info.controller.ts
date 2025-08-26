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
import { MasterReservationBillingInfoService } from "./master-reservation-billing-info.service";
import { UpdateMasterReservationBillingInfoDto } from "./dto/update-master-reservation-billing-info.dto";
import { GetReservationsBillingsDto } from "./dto/get-reservation-billing-info.dto";
import { CreateReservationBillingDetailDto } from "./dto/create-master-reservation-billing-info.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("Reservation Billings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-reservation-billing-info")
export class MasterReservationBillingInfoController {
    constructor(
        private readonly masterReservationBillingInfoService: MasterReservationBillingInfoService
    ) {}

    @Post()
    create(
        @Body()
        createMasterReservationBillingInfoDto: CreateReservationBillingDetailDto
    ) {
        return this.masterReservationBillingInfoService.create(
            createMasterReservationBillingInfoDto
        );
    }

    @Get()
    findAll(@Query() dto: GetReservationsBillingsDto) {
        return this.masterReservationBillingInfoService.findAll(dto);
    }

    @Get("/details/:reservation_id")
    billingTree(@Param("reservation_id") reservation_id: string) {
        return this.masterReservationBillingInfoService.getBillingDetails(
            +reservation_id
        );
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterReservationBillingInfoService.findOne(+id);
    }

    @Patch(":reservation_billing_id")
    update(
        @Param("reservation_billing_id") reservation_billing_id: string,
        @Body()
        updateMasterReservationBillingInfoDto: UpdateMasterReservationBillingInfoDto
    ) {
        return this.masterReservationBillingInfoService.update(
            +reservation_billing_id,
            updateMasterReservationBillingInfoDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterReservationBillingInfoService.remove(+id);
    }
}
