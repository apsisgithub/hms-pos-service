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
import { MasterRoomsService } from "./master-rooms.service";
import { CreateMasterRoomDto } from "./dto/create-master-room.dto";
import { UpdateMasterRoomDto } from "./dto/update-master-room.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RoleName } from "src/common/enums/role-name.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { GetRoomsDto } from "./dto/get-rooms.dto";
import { CreateJointRoomDto } from "./dto/create-joint-room.dto";
import { GetJointRoomsDto } from "./dto/get-joint-rooms.dto";
import { UpdateJointRoomDto } from "./dto/update-joint-room.dto";

@ApiTags("Rooms")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-rooms")
export class MasterRoomsController {
    constructor(private readonly masterRoomsService: MasterRoomsService) {}

    @Post()
    create(@Body() createMasterRoomDto: CreateMasterRoomDto) {
        return this.masterRoomsService.createRoom(createMasterRoomDto);
    }

    @Post("joint-rooms")
    createJointRoom(@Body() dto: CreateJointRoomDto) {
        return this.masterRoomsService.createJointRoom(dto);
    }

    @Get()
    findAll(@Query() dto: GetRoomsDto) {
        return this.masterRoomsService.findAllRooms(dto);
    }

    @Get("joint-rooms")
    findAllJointRooms(@Query() dto: GetJointRoomsDto) {
        return this.masterRoomsService.findAllJointRooms(dto);
    }

    @Get("reservation-details-tree/:sbu_id")
    fetchRoomReservationDetailsTree(@Param("sbu_id") sbu_id: string) {
        return this.masterRoomsService.fetchRoomReservationDetailsTree(+sbu_id);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterRoomsService.findRoomById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterRoomDto: UpdateMasterRoomDto
    ) {
        return this.masterRoomsService.updateRoom(+id, updateMasterRoomDto);
    }

    @Patch("/joint-rooms/:joint_room_id")
    updateJointRoom(
        @Param("joint_room_id") joint_room_id: string,
        @Body() dto: UpdateJointRoomDto
    ) {
        return this.masterRoomsService.updateJointRoom(+joint_room_id, dto);
    }

    @Delete("/joint-rooms/:joint_room_id")
    deleteJointRoom(@Param("joint_room_id") joint_room_id: string) {
        return this.masterRoomsService.deleteJointRoom(+joint_room_id);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterRoomsService.removeRoom(+id);
    }
}
