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
import { MasterSbuService } from "./master_sbu.service";
import { CreateMasterSbuDto } from "./dto/create-master_sbu.dto";
import { UpdateMasterSbuDto } from "./dto/update-master_sbu.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetSbusDto } from "./dto/get-sbus.dto";

@ApiTags("SBU (hotel)")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-sbu")
export class MasterSbuController {
    constructor(private readonly masterSbuService: MasterSbuService) {}

    @Post()
    create(@Body() createMasterSbuDto: CreateMasterSbuDto) {
        console.log("theDto ", createMasterSbuDto);
        return this.masterSbuService.createSbu(createMasterSbuDto);
    }

    @Get()
    findAll(@Query() dto: GetSbusDto) {
        return this.masterSbuService.findAllSbu(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterSbuService.findOneSbu(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterSbuDto: UpdateMasterSbuDto
    ) {
        return this.masterSbuService.updateSbu(+id, updateMasterSbuDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterSbuService.removeSbu(+id);
    }
}
