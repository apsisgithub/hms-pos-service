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
import { MasterRoomTypesService } from "./master-room-types.service";
import { CreateMasterRoomTypeDto } from "./dto/create-master-room-type.dto";
import { UpdateMasterRoomTypeDto } from "./dto/update-master-room-type.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetRoomTypesDto } from "./dto/get-room-types.dto";

@ApiTags("Room-Types")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-room-types")
export class MasterRoomTypesController {
    constructor(
        private readonly masterRoomTypesService: MasterRoomTypesService
    ) {}

    @Post()
    create(@Body() createMasterRoomTypeDto: CreateMasterRoomTypeDto) {
        return this.masterRoomTypesService.createRoomType(
            createMasterRoomTypeDto
        );
    }

    @Get()
    findAll(@Query() dto: GetRoomTypesDto) {
        return this.masterRoomTypesService.findAllRoomTypes(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterRoomTypesService.findRoomTypeById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterRoomTypeDto: UpdateMasterRoomTypeDto
    ) {
        return this.masterRoomTypesService.updateRoomType(
            +id,
            updateMasterRoomTypeDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterRoomTypesService.removeRoomType(+id);
    }
}
