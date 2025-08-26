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
import { MasterGuestsService } from "./master-guests.service";
import { CreateMasterGuestDto } from "./dto/create-master-guest.dto";
import { UpdateMasterGuestDto } from "./dto/update-master-guest.dto";
import { GetGuestsDto } from "./dto/get-guests.dto";
import { SearchGuestDto } from "./dto/search-guest.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import {
    CreateMultipleSharerGuestsDto,
    CreateSharerGuestDto,
} from "./dto/create-sharer.dto";
import { UpdateReservedGuestDto } from "./dto/update-reserved-guest.dto";

@ApiTags("Guests")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-guests")
export class MasterGuestsController {
    constructor(private readonly masterGuestsService: MasterGuestsService) {}

    @Post()
    create(@Body() createMasterGuestDto: CreateMasterGuestDto) {
        return this.masterGuestsService.create(createMasterGuestDto);
    }

    @Post("sharer")
    createSharer(@Body() dto: CreateMultipleSharerGuestsDto) {
        return this.masterGuestsService.createSharerGuest(dto);
    }

    @Get()
    findAll(@Query() dto: GetGuestsDto) {
        return this.masterGuestsService.findAll(dto);
    }

    @Get("search")
    searchGuests(@Query() dto: SearchGuestDto) {
        return this.masterGuestsService.searchGuests(dto);
    }

    @Get("room-wise-guests/:reservation_id")
    getRoomWiseGuests(@Param("reservation_id") reservation_id: string) {
        return this.masterGuestsService.getRoomWiseGuestsByReservation(
            +reservation_id
        );
    }

    @Get("reservation-info/:reservation_id")
    guestInfo(@Param("reservation_id") reservation_id: string) {
        return this.masterGuestsService.getGuestDetailsByReservationId(
            +reservation_id
        );
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterGuestsService.findOne(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterGuestDto: UpdateMasterGuestDto
    ) {
        return this.masterGuestsService.update(+id, updateMasterGuestDto);
    }

    @Patch("room-guest/:reservation_id")
    updateRoomGuest(
        @Param("reservation_id") reservation_id: string,
        @Body() dto: UpdateReservedGuestDto
    ) {
        return this.masterGuestsService.updatedReservedGuest(
            +reservation_id,
            dto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterGuestsService.remove(+id);
    }
}
