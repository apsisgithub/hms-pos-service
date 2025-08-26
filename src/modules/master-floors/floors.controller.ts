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
import { FloorsService } from "./floors.service";
import { CreateMasterFloorDto } from "./dto/create-floor.dto";
import { UpdateFloorDto } from "./dto/update-floor.dto";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RoleName } from "src/common/enums/role-name.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { GetFloorsDto } from "./dto/get-floors.dto";

@ApiTags("Floors")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("floors")
export class FloorsController {
    constructor(private readonly floorsService: FloorsService) {}

    @Post()
    create(@Body() createFloorDto: CreateMasterFloorDto) {
        return this.floorsService.createFloor(createFloorDto);
    }

    @Get()
    findAll(@Query() dto: GetFloorsDto) {
        return this.floorsService.findAllFloors(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.floorsService.findFloorById(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateFloorDto: UpdateFloorDto) {
        return this.floorsService.updateFloor(+id, updateFloorDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.floorsService.removeFloor(+id);
    }
}
