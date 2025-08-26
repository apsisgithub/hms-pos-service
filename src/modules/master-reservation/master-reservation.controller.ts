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
import { MasterReservationService } from "./master-reservation.service";
import { CreateReservationDto } from "./dto/create-master-reservation.dto";
import {
    UpdateMasterReservationDto,
    UpdateReservationStatusDto,
} from "./dto/update-master-reservation.dto";
import {
    GetReservationDto,
    GetStatyviewReservationDto,
} from "./dto/get-reservations.dto";
import { QuickReservationDto } from "./dto/quick-reservation.dto";
import {
    GetStatusWiseReservationRoomCountDto,
    GetStatusWiseRoomCountDto,
} from "./dto/get-status-wise-room-count.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AddCardDto } from "./dto/add-card.dto";
import { ChargeCardDto } from "./dto/charge-card.dto";
import { GetCreditCardsDto } from "./dto/get-credit-cards.dto";
import { SearchCreditCardsDto } from "./dto/search-credit-cards.dto";
import { CreateChargeDto } from "./dto/create-charge.dto";
import { UpdateChargeDto } from "./dto/update-charge.dto";
import { GetChargesDto } from "./dto/get-charges.dto";
import { GetFolioOperationsDto } from "./dto/get-folio-operations.dto";
import { CreateReservationSourceInfoDto } from "./dto/create-reservation-source-info.dto";
import { GetReservationSourcesInfoDto } from "./dto/get-reservation-source-info.dto";
import { UpdateReservationSourceInfoDto } from "./dto/update-reservation-source-info.dto";
import { CreateRoomChargeDto } from "./dto/create-room-charge.dto";
import { CreateFolioDto } from "./dto/create-folio.dto";
import { GetFoliosDto } from "./dto/get-folios.dto";
import { CutFolioDto } from "./dto/cut-folio.dto";
import { SplitFolioDto } from "./dto/split-folio.dto";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdateFolioDto } from "./dto/update-folio.dto";
import { TransferAmountDto } from "./dto/transfer-amount.dto";
import { AddDiscountDto } from "./dto/add-discount.dto";
import { GetReservationRoomsDto } from "./dto/get-reservation-rooms.dto";
import { FindRoomChargesDto } from "./dto/find-room-charges.dto";
import { AssignRoomDto } from "./dto/assign-room.dto";

@ApiTags("Reservations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("reservations")
export class MasterReservationController {
    constructor(
        private readonly masterReservationService: MasterReservationService
    ) {}

    @Post("/full-reservation")
    create(@Body() createReservationDto: CreateReservationDto) {
        return this.masterReservationService.createFullReservation(
            createReservationDto
        );
    }

    @Post("quick-reservation")
    quickReservation(@Body() quickReservationDto: QuickReservationDto) {
        return this.masterReservationService.quickReservation(
            quickReservationDto
        );
    }

    @Get("/stayview-dashboard")
    getStayviewBookingDashboard(@Query() dto: GetStatyviewReservationDto) {
        return this.masterReservationService.getStayviewBookingDashboard(dto);
    }

    @Get("/status-wise-room-count")
    getStatusWiseMasterRoomCount(@Query() dto: GetStatusWiseRoomCountDto) {
        return this.masterReservationService.getStatusWiseMasterRoomCount(
            dto.sbu_id
        );
    }

    @Get("/status-wise-reservation-room-count")
    getStatusWiseSingleReservationRoomCount(
        @Query() dto: GetStatusWiseReservationRoomCountDto
    ) {
        return this.masterReservationService.getStatusWiseSingleReservationRoomCount(
            dto.sbu_id,
            dto.reservation_id
        );
    }

    @Post("source-info")
    createSource(@Body() dto: CreateReservationSourceInfoDto) {
        return this.masterReservationService.createSourceInfo(dto);
    }

    @Get("source-info")
    getAllSourceInfo(@Query() dto: GetReservationSourcesInfoDto) {
        return this.masterReservationService.findAllReservationSources(dto);
    }

    @Get("source-info/:source_info_id")
    getSourceInfoById(@Param("source_info_id") source_info_id: string) {
        return this.masterReservationService.findReservationSourceInfoById(
            +source_info_id
        );
    }

    @Patch("source-info/:source_info_id")
    updateSourceInfo(
        @Param("source_info_id") source_info_id: string,
        @Body()
        dto: UpdateReservationSourceInfoDto
    ) {
        return this.masterReservationService.updateReservationSourceInfo(
            +source_info_id,
            dto
        );
    }

    @Delete("source-info/:source_info_id")
    deleteSourceInfo(@Param("source_info_id") source_info_id: string) {
        return this.masterReservationService.deleteReservationSource(
            +source_info_id
        );
    }

    @Patch("/status/:id")
    updateStatus(
        @Param("id") id: string,
        @Body() dto: UpdateReservationStatusDto
    ) {
        return this.masterReservationService.updateStatus(+id, dto.status);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterReservationDto: UpdateMasterReservationDto
    ) {
        return this.masterReservationService.update(
            +id,
            updateMasterReservationDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterReservationService.remove(+id);
    }

    // Credit Card APIs
    @Post("add-card")
    addCard(@Body() addCardDto: AddCardDto) {
        return this.masterReservationService.addCard(addCardDto);
    }

    @Post("/card/payment")
    chargeCard(@Body() chargeCardDto: ChargeCardDto) {
        return this.masterReservationService.applyPayment(chargeCardDto);
    }

    @Get("credit-cards")
    findAllCreditCards(@Query() dto: GetCreditCardsDto) {
        return this.masterReservationService.findAllCreditCards(dto);
    }

    @Get("credit-cards/search")
    searchCreditCardsByNumber(@Query() dto: SearchCreditCardsDto) {
        return this.masterReservationService.searchCreditCardsByNumber(
            dto.search_term,
            dto.page_number,
            dto.limit
        );
    }

    @Get("credit-cards/:id")
    findOneCreditCard(@Param("id") id: string) {
        return this.masterReservationService.findOneCreditCard(+id);
    }

    // Charges APIs
    @Post("create-charge")
    createCharge(@Body() createChargeDto: CreateChargeDto) {
        return this.masterReservationService.createCharge(createChargeDto);
    }

    @Get("charges/:id")
    findOneCharge(@Param("id") id: string) {
        return this.masterReservationService.findOneCharge(+id);
    }

    @Patch("charges/:id")
    updateCharge(
        @Param("id") id: string,
        @Body() updateChargeDto: UpdateChargeDto
    ) {
        return this.masterReservationService.updateCharge(+id, updateChargeDto);
    }

    @Delete("charges/:id")
    removeCharge(@Param("id") id: string) {
        return this.masterReservationService.removeCharge(+id);
    }

    // Folio Operations
    @Get("folio-operations")
    getFolioOperations(@Query() dto: GetFolioOperationsDto) {
        return this.masterReservationService.getFolioOperations(dto);
    }

    @Post("create-room-charge")
    createRoomCharge(@Body() createChargeDto: CreateRoomChargeDto) {
        return this.masterReservationService.createRoomCharge(createChargeDto);
    }

    // Folio APIs
    @Post("folios")
    createFolio(@Body() createFolioDto: CreateFolioDto) {
        return this.masterReservationService.createFolio(createFolioDto);
    }

    @Get("folios")
    findAllFolios(@Query() dto: GetFoliosDto) {
        return this.masterReservationService.findAllFolios(dto);
    }

    @Get("folios/:id")
    findOneFolio(@Param("id") id: string) {
        return this.masterReservationService.findOneFolio(+id);
    }

    @Get("room-wise-folios/:reservation_id")
    roomWiseFolios(@Param("reservation_id") reservation_id: string) {
        return this.masterReservationService.fetchRoomWiseFoliosByReservationId(
            +reservation_id
        );
    }

    @Patch("folios/:id")
    updateFolio(
        @Param("id") id: string,
        @Body() updateFolioDto: UpdateFolioDto
    ) {
        return this.masterReservationService.updateFolio(+id, updateFolioDto);
    }

    @Post("folios/cut")
    cutFolio(@Body() cutFolioDto: CutFolioDto) {
        return this.masterReservationService.cutFolio(cutFolioDto);
    }

    @Post("folios/split")
    splitFolio(@Body() splitFolioDto: SplitFolioDto) {
        return this.masterReservationService.splitFolio(splitFolioDto);
    }

    @Post("folios/transfer")
    transferAmount(@Body() transferAmountDto: TransferAmountDto) {
        return this.masterReservationService.transferAmount(transferAmountDto);
    }

    // Discount APIs
    @Post("add-folio-discount")
    addDiscount(@Body() addDiscountDto: AddDiscountDto) {
        return this.masterReservationService.addDiscount(addDiscountDto);
    }

    // Payment APIs
    @Post("folio-payments")
    createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.masterReservationService.createPayment(createPaymentDto);
    }

    // Reservation Rooms API
    @Get("rooms")
    getReservationRooms(@Query() dto: GetReservationRoomsDto) {
        return this.masterReservationService.getReservationRooms(dto);
    }

    @Patch("assign-room")
    assignRoom(@Body() assignRoomDto: AssignRoomDto) {
        return this.masterReservationService.assignRoom(assignRoomDto);
    }

    // Room Charges API
    @Get("room-charges")
    findRoomCharges(@Query() dto: FindRoomChargesDto) {
        return this.masterReservationService.findRoomCharges(dto);
    }

    @Get("/details/:id")
    findOne(@Param("id") id: string) {
        return this.masterReservationService.findOne(+id);
    }

    @Get("")
    findAll(@Query() dto: GetReservationDto) {
        return this.masterReservationService.findAll(dto);
    }
}
